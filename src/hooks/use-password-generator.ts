import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export interface PasswordCriteria {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export interface UsePasswordGeneratorReturn {
  password: string
  criteria: PasswordCriteria
  setCriteria: (criteria: PasswordCriteria) => void
  generatePassword: () => void
  getPasswordStrength: () => {
    score: number
    label: string
    feedback: string[]
  }
}

const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

const DEFAULT_CRITERIA: PasswordCriteria = {
  length: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false
}

export function usePasswordGenerator(): UsePasswordGeneratorReturn {
  const [criteria, setCriteriaState] = useKV('password-criteria', DEFAULT_CRITERIA)
  const [password, setPassword] = useState('')

  const setCriteria = useCallback((newCriteria: PasswordCriteria) => {
    // Ensure at least one character type is selected
    const hasAnyType = newCriteria.includeUppercase || 
                      newCriteria.includeLowercase || 
                      newCriteria.includeNumbers || 
                      newCriteria.includeSymbols

    if (!hasAnyType) {
      newCriteria.includeLowercase = true
    }

    setCriteriaState(newCriteria)
  }, [setCriteriaState])

  const generatePassword = useCallback(() => {
    let charset = ''
    
    if (criteria.includeUppercase) charset += CHARACTER_SETS.uppercase
    if (criteria.includeLowercase) charset += CHARACTER_SETS.lowercase
    if (criteria.includeNumbers) charset += CHARACTER_SETS.numbers
    if (criteria.includeSymbols) charset += CHARACTER_SETS.symbols

    if (charset === '') {
      charset = CHARACTER_SETS.lowercase
    }

    // Use crypto.getRandomValues for cryptographically secure random generation
    const array = new Uint8Array(criteria.length)
    crypto.getRandomValues(array)
    
    let result = ''
    for (let i = 0; i < criteria.length; i++) {
      result += charset[array[i] % charset.length]
    }

    // Ensure password meets criteria (at least one character from each selected type)
    let needsRegeneration = false
    
    if (criteria.includeUppercase && !/[A-Z]/.test(result)) needsRegeneration = true
    if (criteria.includeLowercase && !/[a-z]/.test(result)) needsRegeneration = true
    if (criteria.includeNumbers && !/[0-9]/.test(result)) needsRegeneration = true
    if (criteria.includeSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(result)) needsRegeneration = true

    if (needsRegeneration && criteria.length >= 4) {
      // Force include required character types
      const requiredChars = []
      if (criteria.includeUppercase) requiredChars.push(CHARACTER_SETS.uppercase[Math.floor(Math.random() * CHARACTER_SETS.uppercase.length)])
      if (criteria.includeLowercase) requiredChars.push(CHARACTER_SETS.lowercase[Math.floor(Math.random() * CHARACTER_SETS.lowercase.length)])
      if (criteria.includeNumbers) requiredChars.push(CHARACTER_SETS.numbers[Math.floor(Math.random() * CHARACTER_SETS.numbers.length)])
      if (criteria.includeSymbols) requiredChars.push(CHARACTER_SETS.symbols[Math.floor(Math.random() * CHARACTER_SETS.symbols.length)])

      // Replace random positions with required characters
      const resultArray = result.split('')
      requiredChars.forEach((char, index) => {
        if (index < resultArray.length) {
          resultArray[index] = char
        }
      })

      // Shuffle the array
      for (let i = resultArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultArray[i], resultArray[j]] = [resultArray[j], resultArray[i]]
      }

      result = resultArray.join('')
    }

    setPassword(result)
  }, [criteria])

  const getPasswordStrength = useCallback(() => {
    if (!password) {
      return { score: 0, label: 'No password', feedback: ['Generate a password to see strength analysis'] }
    }

    let score = 0
    const feedback: string[] = []

    // Length scoring
    if (password.length >= 12) score += 25
    else if (password.length >= 8) score += 15
    else if (password.length >= 6) score += 5
    else feedback.push('Use at least 8 characters')

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 15
    else feedback.push('Include lowercase letters')

    if (/[A-Z]/.test(password)) score += 15
    else feedback.push('Include uppercase letters')

    if (/[0-9]/.test(password)) score += 15
    else feedback.push('Include numbers')

    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 20
    else feedback.push('Include symbols for maximum security')

    // Bonus for longer passwords
    if (password.length >= 16) score += 10

    // Determine label
    let label = 'Weak'
    if (score >= 85) label = 'Very Strong'
    else if (score >= 70) label = 'Strong'
    else if (score >= 50) label = 'Fair'

    return { score: Math.min(100, score), label, feedback }
  }, [password])

  return {
    password,
    criteria,
    setCriteria,
    generatePassword,
    getPasswordStrength
  }
}