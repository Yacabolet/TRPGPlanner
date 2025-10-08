// === CONFIGURATION & CONSTANTS ===

// Google Apps Script URL for form submission
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyH_UK9KVJPG-9EBmiNVadFu53aJwCmDcaRS_RADM5EKXGOhx17l1TQ-Guywxa8-xvtA/exec';

// Session times in EST
const sessionTimesEST = [
    { day: 'Monday', time: '13:00', label: 'Monday 1pm EST' },
    { day: 'Thursday', time: '13:00', label: 'Thursday 1pm EST' },
    { day: 'Friday', time: '13:00', label: 'Friday 1pm EST' },
    { day: 'Tuesday', time: '01:00', label: 'Tuesday 1am EST' },
    { day: 'Thursday', time: '01:00', label: 'Thursday 1am EST (Late Night)' },
    { day: 'Friday', time: '01:00', label: 'Friday 1am EST (Late Night)' },
    { day: 'Saturday', time: '01:00', label: 'Saturday 1am EST (Late Night)' }
];

// Premade character data
const premadeCharacters = [
    {
        id: 'polder_shadow',
        name: 'Polder Shadow',
        class: 'Shadow (College of Black Ash)',
        ancestry: 'Polder',
        career: 'Criminal',
        imageUrl: 'https://i.imgur.com/o8tfVnm.png',
        description: 'The Polder is your classic Hobbit/Halfling: short, nimble, fearless, and lucky. This one is a Shadow, which is akin to the D&D Rogue but with innate shadowy magic imbued into every ability. They can teleport with ease and engage in hit and run tactics using light weapons like daggers or darts. The Shadow\'s most iconic trait is the ability attained in the second encounter: Hesitation Is Weakness - allowing them to chain their turn after an ally without giving the enemies an opportunity to act.',
        playStyle: 'Striker/Skirmisher',
        strengths: [
            'Easy positioning with your Black Ash Teleport manuever and later abilities',
            'Reactive mobility options',
            'Enemy repositioning options - allowing you to isolate foes',
            'High damage dealing potential, which is further amplified by striking isolated targets'
        ],
        uniqueMechanic: 'Insight: Chaotic resource that you gain 1d3 of every round, enabling increasingly devastating attacks and longer-range teleports. Can be gained by striking enemies with surge-fueled high damage attacks.',
        idealFor: 'Players who enjoy tactical positioning, stealth gameplay, and the fantasy of playing a sneaky assassin.'
    },
    {
        id: 'elementalist_polder',
        name: 'Polder Elementalist',
        class: 'Elementalist (Fire Specialization)',
        ancestry: 'Polder',
        career: 'Mage\'s Apprentice',
        imageUrl: 'https://i.imgur.com/4u3lar6.png',
        description: 'The Polder is a small but magically gifted ancestry, similar to halflings. This Elementalist is like a sorcerer or wizard that wields elemental magic but specializes in fire magic, wielding destructive flames with precision. They use Persistent Magic to maintain their magical effects while sacrificing passive resource generation.',
        playStyle: 'Striker/Controller',
        strengths: [
            'Elemental damage with a fire specialization bonus',
            'Versatility provided by with Practical Magic (Knockback, teleport, minor damage)',
            'Persistent abilities create ongoing battlefield effects',
            'Strong forced movement and positioning control',
            'Innate fire damage reduction'
        ],
        uniqueMechanic: 'Essence: Gained each turn and when creatures take typed damage nearby.',
        idealFor: 'Players who enjoy specializing in elemental magic, resource management with persistent effects, dealing high fire damage, and the fantasy of a pyromancer mage.'
    },
    {
        id: 'conduit_orc',
        name: 'Orc Conduit',
        class: 'Conduit (Life and Sun Domains)',
        ancestry: 'Orc',
        career: 'Disciple',
        imageUrl: 'https://i.imgur.com/OK0wa2U.png',
        description: 'The Orc in Draw Steel is a ancestry which harnesses the rage in their blood for their benefit, similar to traditional fantasy orcs but more magical. The Conduit is a divine healer and damage dealer. They excel at supporting allies while still attacking, doing so even on their signature moves.',
        playStyle: 'Support/Healer',
        strengths: [
            'Powerful and flexible multi-target healing with Healing Grace',
            'Can combine healing and damage in single abilities',
            'Prayer mechanic offers risk/reward for bonus Piety and domain effects',
            'Resurrection capability with Minor Miracle at 3rd level',
            'Longer range than most others range on abilities'
        ],
        uniqueMechanic: 'Piety: Gained from allies regaining Stamina and enemies taking fire/holy damage nearby. Prayer (1d3 roll) can generate bonus Piety and trigger domain effects: Life (healing/temp Stamina) or Sun (fire damage). Rolling 1 while praying angers gods for damage.',
        idealFor: 'Players who enjoy playing dedicated healers, supporting their team, combining divine healing with fire magic, and the fantasy of a devoted cleric.'
    },
    {
        id: 'talent_human',
        name: 'Human Talent',
        class: 'Talent (Telepath)',
        ancestry: 'Human',
        career: 'Agent',
        imageUrl: 'https://i.imgur.com/tknEVfR.png',
        description: 'Humans are generalists, resilient and mundane people who have an unusual aptitude at resisting the unnatural. The Talent is a psionic caster that manipulates minds and matter through telekinesis and telepathy. They use Clarity with a unique Strain mechanic — spending beyond their means for powerful effects but suffering damage from negative Clarity.',
        playStyle: 'Controller/Striker',
        strengths: [
            'Powerful battlefield control through telekinesis (slides and pushes)',
            'Long-range telepathic abilities',
            'Can go into "debt" spending negative Clarity for emergency power',
            'Telepathic communication with allies at range'
        ],
        uniqueMechanic: 'Clarity and Strain: Can spend Clarity you don\'t have (down to -3). Each turn with negative Clarity, take 1 damage per negative point and become Strained. Strained abilities gain bonus effects but often have drawbacks. Gain 1d3 Clarity per turn.',
        idealFor: 'Players who enjoy psychic powers, risk/reward mechanics, controlling enemies through telekinesis, and managing a unique resource system.'
    },
    {
        id: 'null_human',
        name: 'Human Null',
        class: 'Null (Metakinetic)',
        ancestry: 'Human',
        career: 'Farmer',
        imageUrl: 'https://i.imgur.com/pUY5nnN.png',
        description: 'Humans are generalists, resilient and mundane people who have a sense of the supernatural and a tenacity from a history of persistence. The Null is a martial artist, like the monk, but with a psionic twist. They move at incredible speed and project a Null Field that weakens enemy abilities.',
        playStyle: 'Skirmisher/Disruptor',
        strengths: [
            'Exceptional mobility with the innate Null Speed stat and Inertial Step',
            'Null Field reduces all enemy potencies, making it more likely allies are less affected by debilitating status effects',
            'Multiple repositioning options',
            'Psionic Martial Arts allows using Intuition for Knockback/Grab manuevers'
        ],
        uniqueMechanic: 'Discipline: Gained from enemies in Null Field using main actions and Director spending Malice. Grants escalating benefits (2: +2 push, 4: surge when damaged/moved, 6: edge on Grab/Knockback). Null Field aura reduces enemy potency.',
        idealFor: 'Players who enjoy mobile martial arts combat, disrupting enemy abilities, tactical positioning, and the fantasy of a psionic monk.'
    },
    {
        id: 'censor_human',
        name: 'Human Censor',
        class: 'Censor (Paragon)',
        ancestry: 'Human',
        career: 'Watch Officer',
        imageUrl: 'https://i.imgur.com/C52NTyc.png',
        description: 'Humans are generalists, resilient and mundane people who have an unusual aptitude at resisting the unnatural. The Censor mirrors a vengeful paladin who judges the guilty and protects the innocent, this heavily-armored warrior deals holy damage and controls a chosen enemy through their Judgment ability.',
        playStyle: 'Defender/Controller',
        strengths: [
            'Strong single-target control and lockdown capabilities',
            'Heavy armor provides excellent durability',
            'Versatile Wrath spending for control effects (prevent shifting, reduce potency, add taunt)',
            'Powerful ally support with healing and defensive abilities'
        ],
        uniqueMechanic: 'Wrath: Gained from judged enemies damaging you or you damaging them. Spend to disrupt enemy actions (stop shifts, impose banes, reduce potency, add taunts). Judgment marks one enemy with ongoing holy damage when they act.',
        idealFor: 'Players who enjoy playing divine law enforcers, controlling single powerful enemies, and the fantasy of an unstoppable holy warrior bringing judgment.'
    },
    {
        id: 'tactician_high_elf',
        name: 'High Elf Tactician',
        class: 'Tactician (Vanguard)',
        ancestry: 'High Elf',
        career: 'Soldier',
        imageUrl: 'https://i.imgur.com/QRU1j6n.png',
        description: 'The High Elves, like their classic fantasy counterparts, are perceptive creatures who are viewed with some awe and mystique making them charismatic. The Tactician commands the battlefield by marking enemies and coordinating allies, granting edges on attacks against marked targets and allowing allies to heal or reposition.',
        playStyle: 'Leader/Support',
        strengths: [
            'Powerful Mark ability that grants edge to all allies against marked targets',
            'Flexible combat role with both melee and ranged options',
            'Excellent ally support through healing and positioning',
            'High Senses provides edge on noticing threats'
        ],
        uniqueMechanic: 'Focus: Gained from allies damaging marked enemies and using heroic abilities nearby. Spend to grant bonus damage, healing, repositioning, or taunt effects when allies damage your marked target.',
        idealFor: 'Players who enjoy tactical gameplay, coordinating with their team, marking priority targets, and enabling allies to succeed.'
    },
    {
        id: 'fury_dwarf',
        name: 'Dwarf Fury',
        class: 'Fury (Berserker)',
        ancestry: 'Dwarf',
        career: 'Warden',
        imageUrl: 'https://i.imgur.com/QicTxfb.png',
        description: 'The Dwarf is a tough, grounded warrior with stone-like physique. This Fury is a raw damage dealer who fights unarmored with heavy weapons, gaining power from their Ferocity resource. They excel at pushing enemies around and dealing massive damage, with abilities that scale with their growing rage.',
        playStyle: 'Striker/Controller',
        strengths: [
            'Exceptional durability with high Stamina and the dwarven Grounded trait',
            'Powerful forced movement with Primordial Strength bonuses',
            'High burst damage potential with signature abilities',
            'Strong crowd control through pushes and area attacks'
        ],
        uniqueMechanic: 'Ferocity: Builds from taking damage and becoming winded. Grants escalating benefits at thresholds (2: +2 push distance, 4: surge on push, 6: edge on Might tests and Knockback).',
        idealFor: 'Players who enjoy high-risk, high-reward melee combat, controlling enemy positioning, and the fantasy of an unstoppable berserker warrior.'
    },
    {
        id: 'troubadour_wode',
        name: 'Wode Elf Troubadour',
        class: 'Troubadour (Virtuoso)',
        ancestry: 'Wode Elf',
        career: 'Performer',
        imageUrl: 'https://i.imgur.com/hA6dCOo.png',
        description: 'The Wode Elf is a nimble fey creature with natural grace - more feral than your typical fantasy elf. This Troubadour is a performer and support specialist who uses musical magic to inspire allies and control the battlefield. Their Drama resource builds from exciting combat moments, allowing them to enhance abilities and even return from death with 30 Drama.',
        playStyle: 'Support/Controller',
        strengths: [
            'Excellent mobility with Swift (speed 6) and Fancy Footwork',
            'Powerful ally support through Witty Banter and performances',
            'Area crowd control and damage capabilities',
            'Can return from death if they gain enough drama, and can gain it beyond death'
        ],
        uniqueMechanic: 'Drama: Chaotic resource gained from exciting combat moments (3+ heroes acting together, heroes becoming winded, natural 19-20 rolls, deaths). Can resurrect at 30 Drama. Used to enhance abilities and trigger powerful effects.',
        idealFor: 'Players who enjoy supporting their team, creating dramatic moments, and using musical performative magic to control the flow of battle.'
    }
];