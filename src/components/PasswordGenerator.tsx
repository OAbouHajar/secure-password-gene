import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Shield, Copy, RefreshCw, Check } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { usePasswordGenerator } from '@/hooks/use-password-generator'
import { motion, AnimatePresence } from 'framer-motion'

export function PasswordGenerator() {
  const { password, criteria, setCriteria, generatePassword, getPasswordStrength } = usePasswordGenerator()
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const strength = getPasswordStrength()

  useEffect(() => {
    if (!password) {
      generatePassword()
    }
  }, [password, generatePassword])

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Add small delay for animation
    await new Promise(resolve => setTimeout(resolve, 200))
    generatePassword()
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    if (!password) return

    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      toast.success('Password copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy password')
    }
  }

  const handleCriteriaChange = (key: keyof typeof criteria, value: boolean | number) => {
    const newCriteria = { ...criteria, [key]: value }
    setCriteria(newCriteria)
  }

  const getStrengthColor = () => {
    if (strength.score >= 85) return 'bg-green-500'
    if (strength.score >= 70) return 'bg-blue-500'
    if (strength.score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStrengthBadgeVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (strength.score >= 85) return 'default'
    if (strength.score >= 70) return 'secondary'
    if (strength.score >= 50) return 'outline'
    return 'destructive'
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield size={32} className="text-primary" weight="fill" />
            <h1 className="text-3xl font-bold text-foreground">Secure Password Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate cryptographically secure passwords with customizable criteria
          </p>
        </div>

        {/* Password Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={password}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-muted p-4 rounded-md border-2 border-dashed border-border"
                >
                  <div className="font-mono text-lg break-all select-all text-center">
                    {password || 'Click generate to create a password'}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1"
              >
                <RefreshCw 
                  size={16} 
                  className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} 
                />
                {isGenerating ? 'Generating...' : 'Generate Password'}
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                disabled={!password || copied}
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </div>

            {/* Strength Indicator */}
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Password Strength</span>
                  <Badge variant={getStrengthBadgeVariant()}>{strength.label}</Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={strength.score} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {strength.score}/100 points
                  </div>
                </div>
                {strength.feedback.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Suggestions: </span>
                    {strength.feedback.join(', ')}
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Criteria Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Password Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Length</label>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {criteria.length} characters
                </span>
              </div>
              <Slider
                value={[criteria.length]}
                onValueChange={([value]) => handleCriteriaChange('length', value)}
                min={4}
                max={128}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Type Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Include Characters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={criteria.includeUppercase}
                    onCheckedChange={(checked) => 
                      handleCriteriaChange('includeUppercase', !!checked)
                    }
                  />
                  <label htmlFor="uppercase" className="text-sm">
                    Uppercase Letters <span className="font-mono text-xs text-muted-foreground">(A-Z)</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={criteria.includeLowercase}
                    onCheckedChange={(checked) => 
                      handleCriteriaChange('includeLowercase', !!checked)
                    }
                  />
                  <label htmlFor="lowercase" className="text-sm">
                    Lowercase Letters <span className="font-mono text-xs text-muted-foreground">(a-z)</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={criteria.includeNumbers}
                    onCheckedChange={(checked) => 
                      handleCriteriaChange('includeNumbers', !!checked)
                    }
                  />
                  <label htmlFor="numbers" className="text-sm">
                    Numbers <span className="font-mono text-xs text-muted-foreground">(0-9)</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={criteria.includeSymbols}
                    onCheckedChange={(checked) => 
                      handleCriteriaChange('includeSymbols', !!checked)
                    }
                  />
                  <label htmlFor="symbols" className="text-sm">
                    Symbols <span className="font-mono text-xs text-muted-foreground">(!@#$...)</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-accent mt-0.5" weight="fill" />
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-accent-foreground">Security Notice</h3>
                <p className="text-xs text-muted-foreground">
                  Passwords are generated using cryptographically secure random number generation. 
                  No passwords are stored or transmitted. For maximum security, use unique passwords 
                  for each account and consider using a password manager.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}