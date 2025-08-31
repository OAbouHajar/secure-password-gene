# Password Generator Tool

Generate cryptographically secure passwords with customizable criteria for enhanced digital security.

**Experience Qualities**:
1. **Trustworthy** - Users must feel confident in the security and randomness of generated passwords
2. **Intuitive** - Password criteria selection should be immediately understandable without explanation
3. **Efficient** - Instant generation with quick customization and easy copying to clipboard

**Complexity Level**: Micro Tool (single-purpose)
- Focused solely on password generation with clear, simple controls for maximum usability and trust

## Essential Features

**Password Generation**
- Functionality: Creates cryptographically secure random passwords using Web Crypto API
- Purpose: Provides users with strong, unpredictable passwords for digital security
- Trigger: Click "Generate Password" button or modify any criteria setting
- Progression: Select criteria → Click generate → View password → Copy to clipboard
- Success criteria: Password matches all selected criteria and passes entropy validation

**Criteria Customization**
- Functionality: Toggle character sets (uppercase, lowercase, numbers, symbols) and set length
- Purpose: Allows users to meet specific password requirements for different services
- Trigger: Interact with checkboxes or length slider
- Progression: Toggle desired options → Length adjustment → Auto-regenerate → Review result
- Success criteria: Generated password contains only selected character types at specified length

**Copy to Clipboard**
- Functionality: One-click copying of generated password with visual confirmation
- Purpose: Seamless integration into user's workflow for password creation
- Trigger: Click copy button or generated password text
- Progression: Click copy → Visual feedback → Password in clipboard → Ready to paste
- Success criteria: Password successfully copied with clear user feedback

**Password Strength Indicator**
- Functionality: Real-time visual assessment of password entropy and strength
- Purpose: Educates users on password quality and builds confidence in generated passwords
- Trigger: Password generation or criteria changes
- Progression: Generate password → Calculate entropy → Display strength meter → Show recommendations
- Success criteria: Accurate strength assessment with actionable feedback for improvement

## Edge Case Handling

- **No criteria selected**: Automatically enable lowercase letters to ensure valid generation
- **Extremely short length**: Warn user when length is insufficient for selected criteria
- **Copy failure**: Show error message and provide manual selection fallback
- **Invalid character combinations**: Prevent impossible combinations and guide user to valid settings

## Design Direction

The design should feel professional and trustworthy, like a security-focused banking application, with clean lines and confidence-inspiring visual hierarchy that emphasizes the generated password as the primary focus.

## Color Selection

Complementary (opposite colors) - Using blue for trust/security and orange for actions/alerts to create clear visual distinction between informational and interactive elements.

- **Primary Color**: Deep Security Blue (oklch(0.3 0.15 240)) - communicates trust, security, and professionalism
- **Secondary Colors**: Clean Gray (oklch(0.85 0.02 240)) for backgrounds and Charcoal (oklch(0.25 0.02 240)) for text
- **Accent Color**: Confident Orange (oklch(0.65 0.15 40)) for call-to-action buttons and strength indicators
- **Foreground/Background Pairings**: 
  - Background (Clean White oklch(0.98 0.01 240)): Charcoal text (oklch(0.25 0.02 240)) - Ratio 12.8:1 ✓
  - Primary (Security Blue oklch(0.3 0.15 240)): White text (oklch(0.98 0.01 240)) - Ratio 8.2:1 ✓
  - Accent (Confident Orange oklch(0.65 0.15 40)): White text (oklch(0.98 0.01 240)) - Ratio 4.9:1 ✓
  - Secondary (Clean Gray oklch(0.85 0.02 240)): Charcoal text (oklch(0.25 0.02 240)) - Ratio 5.1:1 ✓

## Font Selection

Typography should convey precision and reliability with a monospace font for passwords and clean sans-serif for interface elements.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - Password Display: JetBrains Mono Medium/24px/normal spacing for clear character distinction
  - Labels: Inter Medium/16px/normal spacing
  - Body Text: Inter Regular/14px/relaxed spacing
  - Button Text: Inter Semibold/14px/normal spacing

## Animations

Subtle and purposeful animations that reinforce security and precision, avoiding flashy effects that might undermine trust in the tool's reliability.

- **Purposeful Meaning**: Smooth transitions communicate precision and control, while quick feedback animations build confidence in the tool's responsiveness
- **Hierarchy of Movement**: Password generation gets primary animation focus with gentle fade-in, while strength meter animates to show real-time feedback, and copy confirmation provides satisfying micro-feedback

## Component Selection

- **Components**: Card for main container, Button for generation/copy actions, Checkbox for criteria selection, Slider for length control, Progress for strength meter, Badge for strength labels
- **Customizations**: Custom password display component with monospace styling, custom strength meter with color coding, copy button with integrated success state
- **States**: Generate button (default/hover/active/generating), Copy button (default/hover/copied), Checkboxes (unchecked/checked/disabled), Slider (dragging/idle)
- **Icon Selection**: Shield for security, Copy for clipboard action, RefreshCw for regeneration, Eye/EyeOff for password visibility toggle
- **Spacing**: Consistent 4-unit (16px) spacing between major sections, 2-unit (8px) for related controls, 6-unit (24px) for visual separation
- **Mobile**: Single-column layout with larger touch targets, simplified criteria in expandable section, prominent generate button, easy thumb-reach copy action