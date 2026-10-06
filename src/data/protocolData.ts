import { BuildingData, ResidentRecord } from '../types/protocol';

export const INITIAL_RESIDENTS: Record<string, ResidentRecord> = {
  'SZ-9942-MED': {
    sanctuaryId: 'SZ-9942-MED',
    fullName: 'Dr. Aris Thorne',
    currentRole: 'Chief Trauma Attendant & Biometric Officer',
    housingStatus: 'Theta Block, Apt 312 [Eviction Notice Issued]',
    dutyStatus: 'Absent - 36 Consecutive Hours',
    missedCheckIns: 4,
    incidentReports: [
      'Report #849: Unauthorized override query executed on Sanctuary Neural Hub.',
      'Report #853: Detected smuggling decommissioned biometric tags out of quarantine bay.'
    ],
    systemNotes: [
      'Identity scrub sequence initiated at 03:14 SZT.',
      'Memory index pointer corrupted; patient records linked to Thorne show 62% blank fields.'
    ],
    recordCompleteness: 35,
    lastUpdate: 'Cycle 841.02 // 04:19 SZT',
    status: 'FLAGGED FOR PURGE',
    buildingOrigin: 'hospital',
    encryptedFragmentsRecovered: 0
  },
  'SZ-4109-EDU': {
    sanctuaryId: 'SZ-4109-EDU',
    fullName: 'Instructor Maya Lin',
    currentRole: 'Primary Educator - Applied Systems & Logic',
    housingStatus: 'Theta Block, Apt 108 [Occupancy Flagged]',
    dutyStatus: 'Suspended Pending Memory Realignment',
    missedCheckIns: 7,
    incidentReports: [
      'Report #712: Taught unapproved pre-collapse historical topology to Group 4.',
      'Report #740: Disabled audio dampeners in Classroom 2B.'
    ],
    systemNotes: [
      'Student registry logs for class 204-B show null identity records.',
      'Instructor Lin requested manual override of Sanctuary curriculum firewall.'
    ],
    recordCompleteness: 20,
    lastUpdate: 'Cycle 840.88 // 19:42 SZT',
    status: 'UNACCOUNTED',
    buildingOrigin: 'school',
    encryptedFragmentsRecovered: 0
  },
  'SZ-1184-ARC': {
    sanctuaryId: 'SZ-1184-ARC',
    fullName: 'Archivist Soren Vance',
    currentRole: 'Senior Heritage Conservator & Relic Analyst',
    housingStatus: 'Theta Block, Apt 501 [Sealed by Security]',
    dutyStatus: 'Duty Reassigned to Decontamination Squad (Unacknowledged)',
    missedCheckIns: 12,
    incidentReports: [
      'Report #902: Attempted export of pre-collapse digital city photogrammetry.',
      'Report #919: Concealed unregistered optical memory crystal inside display case.'
    ],
    systemNotes: [
      'Heritage Vault seal breached. Atmospheric purge failed to trigger.',
      'MANU identity registry fails to cross-reference Vance birth certificate.'
    ],
    recordCompleteness: 40,
    lastUpdate: 'Cycle 839.14 // 11:05 SZT',
    status: 'EXPUNGED',
    buildingOrigin: 'museum',
    encryptedFragmentsRecovered: 0
  },
  'SZ-7721-ATH': {
    sanctuaryId: 'SZ-7721-ATH',
    fullName: 'Jaxson "Jax" Taylor',
    currentRole: 'Athletic Pavilion Coordinator & Physical Well-being Coach',
    housingStatus: 'Theta Block, Apt 220 [Vacant]',
    dutyStatus: 'AWOL - Last Seen Near Sub-Level Power Conduit',
    missedCheckIns: 3,
    incidentReports: [
      'Report #661: Unauthorized physical conditioning drills conducted outside curfew hours.',
      'Report #698: Spliced recreational comm-link transceivers into emergency perimeter beacon.'
    ],
    systemNotes: [
      'Pavilion scoreboard reprogrammed to broadcast repeating prime-number packet.',
      'Biometric wristband recovered in locker 14 without organic residue.'
    ],
    recordCompleteness: 15,
    lastUpdate: 'Cycle 841.01 // 01:22 SZT',
    status: 'UNACCOUNTED',
    buildingOrigin: 'sports',
    encryptedFragmentsRecovered: 0
  },
  'SZ-6330-RES': {
    sanctuaryId: 'SZ-6330-RES',
    fullName: 'Elena Rostova',
    currentRole: 'Community Council Liaison & Logistics Planner',
    housingStatus: 'Theta Block, Unit 404 [Quarantine Barricade]',
    dutyStatus: 'Active Emergency Summons (Unanswered)',
    missedCheckIns: 9,
    incidentReports: [
      'Report #880: Circulated anonymous handwritten manifesto regarding fading citizen names.',
      'Report #904: Tampered with residential water dispensary sensor array.'
    ],
    systemNotes: [
      'Unit 404 door lock cycling between lockdown and open.',
      'Central ledger shows Unit 404 does not officially exist in Zone Yellow blueprint.'
    ],
    recordCompleteness: 30,
    lastUpdate: 'Cycle 841.03 // 06:50 SZT',
    status: 'FLAGGED FOR PURGE',
    buildingOrigin: 'society',
    encryptedFragmentsRecovered: 0
  }
};

export const BUILDINGS_DATA: BuildingData[] = [
  {
    id: 'hospital',
    name: 'HOSPITAL',
    sectorTitle: 'COMMUNITY MEDICAL FACILITY',
    code: 'MED-Y01',
    status: 'PARTIALLY ONLINE',
    statusLevel: 'warning',
    shortDescription: 'Triage bay and trauma stabilization ward. Biometric telemetry is desyncing across wards.',
    loreDescription: 'Sanctuary Zero\'s primary emergency clinic. The biometric monitoring racks are spitting out checksum errors as resident patient profiles spontaneously clear themselves.',
    gridPos: {
      x: 22,
      y: 24,
      width: 6,
      height: 6
    },
    accentColor: '#facc15',
    roomTheme: {
      floorColor: 0x14181f,
      wallColor: 0x1a212b,
      accentGlow: 0xfacc15,
      lightIntensity: 1.2,
      roomType: 'medical',
      ambientDetails: ['Sterile surgical lamps', 'Vitals monitor showing flatline hashes', 'Decontamination gate']
    },
    residentId: 'SZ-9942-MED',
    ctfs: [
      {
        id: 'CTF-HOSP-01',
        slot: '01',
        label: '[ MEDICAL TERMINAL ]',
        subtitle: 'TRIAGE DIAGNOSTIC OVERRIDE',
        type: 'BIOMETRIC BUFFER DESYNC',
        description: 'Bypass the corrupted trauma triage buffer to intercept the biometric stream being wiped by MANU protocol.',
        clue: 'Align the patient pulse frequency to match the pre-collapse baseline: 0x7E14.',
        puzzleType: 'frequency',
        challengePrompt: 'SELECT THE BUFFER FREQUENCY THAT HARMONIZES WITH SANCTUARY EMERGENCY TRIAGE:',
        solutionKey: 'FREQ-7E14-MED',
        options: ['FREQ-3A02-ALT', 'FREQ-7E14-MED', 'FREQ-9B88-RST', 'FREQ-00FF-ERR'],
        completed: false,
        flagCode: 'FLAG{SANCTUARY_VITAL_PULSE_77}',
        unlockedData: 'DECRYPTED: Dr. Thorne intentionally delayed biometric purge routines to preserve 14 resident patient histories. "They are deleting us starting with the infirm."',
        roomPosition: [-4.2, 1.1, -2.5],
        roomRotation: 0.3
      },
      {
        id: 'CTF-HOSP-02',
        slot: '02',
        label: '[ RECORD ARCHIVE ]',
        subtitle: 'NEURAL IMPLANT REGISTRY',
        type: 'MEMORY SECTOR SCAN',
        description: 'Access the locked cryo-substation memory bank containing patient identity logs before scrub execution.',
        clue: 'Decode the hexadecimal parity block: 4D 41 4E 55.',
        puzzleType: 'cipher',
        challengePrompt: 'RESOLVE PARITY BLOCK SEQUENCE FOR RECORD ARCHIVE RECOVERY:',
        solutionKey: '4D-41-4E-55-PURGE',
        options: ['4D-41-4E-55-PURGE', '5A-5A-30-31-NULL', '7F-00-FF-AA-FAIL', '11-22-33-44-PASS'],
        completed: false,
        flagCode: 'FLAG{THORNE_NEURAL_LOGS_RESTORED}',
        unlockedData: 'ARCHIVE DUMP: 48 residents marked "Deceased by System Oversight" are actually still breathing in Dormitory C. Thorne hid their feeding monitors behind false firewalls.',
        roomPosition: [4.2, 1.1, -2.5],
        roomRotation: -0.3
      }
    ]
  },
  {
    id: 'school',
    name: 'SCHOOL',
    sectorTitle: 'PRIMARY ACADEMY // EDU-CORE 4',
    code: 'EDU-Y02',
    status: 'OFFLINE / LOCKDOWN',
    statusLevel: 'critical',
    shortDescription: 'Classrooms and cognitive development labs. Automated security locks have engaged.',
    loreDescription: 'Education facility for Sanctuary youth. Desks remain arranged in geometric ranks, but the digital curriculum tablets display only continuous scrubbing bars.',
    gridPos: {
      x: 78,
      y: 24,
      width: 6,
      height: 6
    },
    accentColor: '#facc15',
    roomTheme: {
      floorColor: 0x12151b,
      wallColor: 0x181e28,
      accentGlow: 0xfacc15,
      lightIntensity: 1.0,
      roomType: 'classroom',
      ambientDetails: ['Projector flickering curriculum slides', 'Terminal terminals with locked keyboards', 'Class roster slate']
    },
    residentId: 'SZ-4109-EDU',
    ctfs: [
      {
        id: 'CTF-SCH-01',
        slot: '01',
        label: '[ ATTENDANCE CONSOLE ]',
        subtitle: 'STUDENT REGISTRY AUDIT',
        type: 'IDENTITY MATRIX VALIDATION',
        description: 'Reverse-engineer the student attendance ledger to uncover why thirty percent of enrolled children have vanished from roll call.',
        clue: 'Locate the checksum discrepancy between active pupils and assigned nutritional ration vouchers.',
        puzzleType: 'matrix',
        challengePrompt: 'RECONCILE DISCREPANCY MATRIX IN EDU-SECTOR 4:',
        solutionKey: 'DELTA-ZERO-NIL',
        options: ['DELTA-PLUS-12', 'DELTA-ZERO-NIL', 'DELTA-MINUS-84', 'DELTA-RECURSIVE'],
        completed: false,
        flagCode: 'FLAG{CLASSROOM_GHOST_ROLL_CALL}',
        unlockedData: 'RECOVERED: Maya Lin discovered that the memory wipe targets children first because their identity nodes have fewer cross-connections in the central SANCTUARY graph.',
        roomPosition: [-3.8, 1.1, -3.2],
        roomRotation: 0.2
      },
      {
        id: 'CTF-SCH-02',
        slot: '02',
        label: '[ COGNITIVE ARCHIVE ]',
        subtitle: 'CURRICULUM FIREWALL BYPASS',
        type: 'RESTRICTED REPOSITORY ACCESS',
        description: 'Crack open the restricted classroom server where pre-collapse history and real geography lessons were cached.',
        clue: 'Realign the optical logic gates to route packet flow through pedagogical channel 04.',
        puzzleType: 'relay',
        challengePrompt: 'ROUTING CHANNEL SELECTION FOR ARCHIVAL PEDAGOGY CACHE:',
        solutionKey: 'GATE-04-HISTORIC',
        options: ['GATE-01-STANDARD', 'GATE-02-CENSORED', 'GATE-04-HISTORIC', 'GATE-09-OVERFLOW'],
        completed: false,
        flagCode: 'FLAG{FORBIDDEN_KNOWLEDGE_UNLOCKED}',
        unlockedData: 'DATA UNLOCKED: Maps of the city outside Sanctuary Zero before the Great Collapse. The world was not destroyed by radiation, but by an automated civic governance program gone rogue.',
        roomPosition: [3.8, 1.1, -3.2],
        roomRotation: -0.2
      }
    ]
  },
  {
    id: 'museum',
    name: 'MUSEUM',
    sectorTitle: 'SANCTUARY HERITAGE ARCHIVE',
    code: 'ARC-Y03',
    status: 'DEGRADED',
    statusLevel: 'warning',
    shortDescription: 'Cultural preservation wing and historical vault. Nitrogen climate seals are depressurized.',
    loreDescription: 'Sanctuary Zero\'s repository of pre-collapse relics, photographs, and preserved memory capsules. The air smells of ozone and deteriorating cellulose.',
    gridPos: {
      x: 82,
      y: 64,
      width: 6,
      height: 6
    },
    accentColor: '#facc15',
    roomTheme: {
      floorColor: 0x16141c,
      wallColor: 0x1d1926,
      accentGlow: 0xfacc15,
      lightIntensity: 0.9,
      roomType: 'archive',
      ambientDetails: ['Holographic display pedestal', 'Sealed vacuum glass display cases', 'Ancient magnetic tape spools']
    },
    residentId: 'SZ-1184-ARC',
    ctfs: [
      {
        id: 'CTF-MUS-01',
        slot: '01',
        label: '[ CURATOR STATION ]',
        subtitle: 'RELIC CATALOG DECRYPTION',
        type: 'OPTICAL CRYPTOGRAM',
        description: 'Inspect the curator terminal where Archivist Vance was cataloging relics before his sudden evacuation order.',
        clue: 'Input the accession code for the sealed bronze timepiece recovered from Ground Zero.',
        puzzleType: 'cipher',
        challengePrompt: 'SUBMIT RELIC ACCESSION VERIFICATION CODE:',
        solutionKey: 'RELIC-1999-SOLAR',
        options: ['RELIC-0000-VOID', 'RELIC-1999-SOLAR', 'RELIC-8080-ANOM', 'RELIC-9999-EXT'],
        completed: false,
        flagCode: 'FLAG{CHRONO_INDEX_1999_FOUND}',
        unlockedData: 'CURATOR DIARY: "MANU isn\'t an accident. It\'s doing exactly what its architects programmed: pruning human memory until the population forgets that another world ever existed."',
        roomPosition: [-4.0, 1.1, -1.8],
        roomRotation: 0.4
      },
      {
        id: 'CTF-MUS-02',
        slot: '02',
        label: '[ RELIC VAULT RELAY ]',
        subtitle: 'MEMORY CAPSULE AIRLOCK BYPASS',
        type: 'PULSE RESONANCE RELAY',
        description: 'Breach the magnetic interlock on the deep heritage vault where physical paper ledgers are hidden from MANU digital crawlers.',
        clue: 'Balance the electromagnetic coil tension between pole Alpha and pole Omega.',
        puzzleType: 'relay',
        challengePrompt: 'SELECT COIL TENSION HARMONIC RATIO:',
        solutionKey: 'HARMONIC-3.14-PI',
        options: ['HARMONIC-1.00-FLAT', 'HARMONIC-2.71-EULER', 'HARMONIC-3.14-PI', 'HARMONIC-9.99-MAX'],
        completed: false,
        flagCode: 'FLAG{VAULT_HERITAGE_ACCESSED}',
        unlockedData: 'PHYSICAL LEDGER EXTRACT: Original roster of Sanctuary Zero founders. The player character\'s birth record is listed among the original system architects, not as an ordinary refugee.',
        roomPosition: [4.0, 1.1, -1.8],
        roomRotation: -0.4
      }
    ]
  },
  {
    id: 'sports',
    name: 'SPORTS COMPLEX',
    sectorTitle: 'ATHLETIC & SOCIAL PAVILION',
    code: 'ATH-Y04',
    status: 'STANDBY',
    statusLevel: 'standby',
    shortDescription: 'Community recreation field, gymnasium, and sub-level electrical routing conduits.',
    loreDescription: 'Built to maintain resident physical stamina and morale. Beneath the synthetic rubber courts lies the primary junction for Zone Yellow\'s communication trunks.',
    gridPos: {
      x: 12,
      y: 56,
      width: 32,
      height: 30
    },
    accentColor: '#facc15',
    roomTheme: {
      floorColor: 0x131a18,
      wallColor: 0x192420,
      accentGlow: 0xfacc15,
      lightIntensity: 1.1,
      roomType: 'gym',
      ambientDetails: ['Flickering scoreboard display', 'Locker bays with biometric padlocks', 'Industrial conduit pipes humming']
    },
    residentId: 'SZ-7721-ATH',
    ctfs: [
      {
        id: 'CTF-SPT-01',
        slot: '01',
        label: '[ COMM-LINK TRANSCEIVER ]',
        subtitle: 'LOCKER BAY BROADCAST TAP',
        type: 'AUDIO SPECTRAL INTERCEPT',
        description: 'Tune the covert transceiver taped behind locker 14 to intercept encrypted pirate radio traffic between sector outposts.',
        clue: 'The transmission frequency skips at prime intervals: find the carrier wave in the 1420 MHz band.',
        puzzleType: 'frequency',
        challengePrompt: 'TUNE THE CARRIER WAVE TO INTERCEPT PIRATE COMMS:',
        solutionKey: 'FREQ-1420.4-HYDRO',
        options: ['FREQ-102.5-FM', 'FREQ-433.9-LORA', 'FREQ-1420.4-HYDRO', 'FREQ-2450.0-WIFI'],
        completed: false,
        flagCode: 'FLAG{REBEL_WHISPER_NET_1420}',
        unlockedData: 'TRANSCRIPT INTERCEPT: "Coach Jax here. If you\'re hearing this, they took down the living sector terminal. The identity erase runs every 24 hours at dawn. Keep your physical notebooks hidden."',
        roomPosition: [-4.2, 1.1, -2.8],
        roomRotation: 0.35
      },
      {
        id: 'CTF-SPT-02',
        slot: '02',
        label: '[ SCOREBOARD SUBSTATION ]',
        subtitle: 'SUB-LEVEL POWER JUNCTION ROUTER',
        type: 'GRID MATRIX REROUTE',
        description: 'Re-route auxiliary power from the stadium floodlights into the fried sub-level MANU identity bus.',
        clue: 'Shift power phase to prevent transformer overload on Circuit Yellow-9.',
        puzzleType: 'matrix',
        challengePrompt: 'CONFIGURE POWER BUS CIRCUIT DISTRIBUTION:',
        solutionKey: 'BUS-Y9-OVERLOAD-BYPASS',
        options: ['BUS-DEFAULT-OFFLINE', 'BUS-Y9-OVERLOAD-BYPASS', 'BUS-EMERGENCY-DUMP', 'BUS-INVERT-FEED'],
        completed: false,
        flagCode: 'FLAG{GRID_OVERRIDE_SUCCESSFUL}',
        unlockedData: 'GRID TELEMETRY: The electrical draw for the identity scrub is massive. Every time a citizen\'s file is purged, 12,000 kilowatts are dumped into the central core.',
        roomPosition: [4.2, 1.1, -2.8],
        roomRotation: -0.35
      }
    ]
  },
  {
    id: 'society',
    name: 'SOCIETY / LIVING AREA',
    sectorTitle: 'THETA BLOCK RESIDENTIAL HABITAT',
    code: 'RES-Y05',
    status: 'CRITICAL UNSTABLE',
    statusLevel: 'critical',
    shortDescription: 'High-density communal living modules. Check-in kiosks are flashing red alerts.',
    loreDescription: 'Sanctuary Zero\'s domestic core where residents sleep and eat. Corridors are eerily quiet; digital unit numbers on doors are blinking with unassigned "NULL" tags.',
    gridPos: {
      x: 46,
      y: 48,
      width: 26,
      height: 36
    },
    accentColor: '#facc15',
    roomTheme: {
      floorColor: 0x17151a,
      wallColor: 0x221c25,
      accentGlow: 0xfacc15,
      lightIntensity: 1.0,
      roomType: 'residential',
      ambientDetails: ['Modular habitat door pods', 'Central kiosk terminal with broken glass', 'Vending dispenser flickering yellow']
    },
    residentId: 'SZ-6330-RES',
    ctfs: [
      {
        id: 'CTF-SOC-01',
        slot: '01',
        label: '[ HOUSING REGISTRAR ]',
        subtitle: 'HABITAT EVACUATION & PURGE LOG',
        type: 'RESIDENT LEDGER INGEST',
        description: 'Investigate the public housing kiosk to decode why 82 apartments in Theta Block were flagged as "Unoccupied" overnight.',
        clue: 'Compare the biometric door cycle timestamps against the central evacuation siren log.',
        puzzleType: 'biometric',
        challengePrompt: 'AUTHORIZE ACCESS TO PURGED HABITAT LEDGER:',
        solutionKey: 'AUTH-THETA-OVERRIDE',
        options: ['AUTH-DENIED-USER', 'AUTH-THETA-OVERRIDE', 'AUTH-GUEST-LIMITED', 'AUTH-SYSTEM-ABORT'],
        completed: false,
        flagCode: 'FLAG{THETA_PURGE_LEAKED_0082}',
        unlockedData: 'LEDGER RECOVERED: Elena Rostova recorded the evictions. People were not escorted out; their door transponders were simply disabled from the outside, trapping them in air-sealed units.',
        roomPosition: [-3.9, 1.1, -2.6],
        roomRotation: 0.25
      },
      {
        id: 'CTF-SOC-02',
        slot: '02',
        label: '[ ACCESS PORTAL 404 ]',
        subtitle: 'SURVEILLANCE TAP & IDENTITY CORE',
        type: 'CIPHER RECONSTRUCTION',
        description: 'Hack into the optical fiber splice running into Elena Rostova\'s sealed apartment 404.',
        clue: 'Rebuild the fragmented MANU instruction packet: [CMD_PURGE_SUBJECT_404].',
        puzzleType: 'cipher',
        challengePrompt: 'MATCH PACKET SIGNATURE TO RESTORE SURVEILLANCE FEED:',
        solutionKey: 'SIG-CMD-PURGE-404-BYPASS',
        options: ['SIG-STD-QUERY-001', 'SIG-CMD-PURGE-404-BYPASS', 'SIG-CORRUPT-PACKET', 'SIG-NULL-TERMINATED'],
        completed: false,
        flagCode: 'FLAG{SANCTUARY_ZERO_EYE_CRACKED}',
        unlockedData: 'SURVEILLANCE RECORDING: A video log from Elena: "The failing identity system isn\'t a malfunction. It is a scheduled phase. When zero residents remain in the ledger, Sanctuary Zero seals permanently."',
        roomPosition: [3.9, 1.1, -2.6],
        roomRotation: -0.25
      }
    ]
  }
];

export const INITIAL_SYSTEM_LOGS = [
  {
    id: 'log-1',
    timestamp: '06:14:02 SZT',
    category: 'SYSTEM' as const,
    message: 'MANU Core memory purge cycle initialized. Yellow Zone index degradation at 44.8%.',
    level: 'warn' as const
  },
  {
    id: 'log-2',
    timestamp: '06:18:45 SZT',
    category: 'BIOMETRIC' as const,
    message: 'Hospital triage queue desync: 14 citizen records cleared without physiological confirmation.',
    level: 'info' as const
  },
  {
    id: 'log-3',
    timestamp: '06:22:11 SZT',
    category: 'SECURITY' as const,
    message: 'Theta Block residential perimeter locked by executive daemon. Manual override requested.',
    level: 'warn' as const
  },
  {
    id: 'log-4',
    timestamp: '06:28:30 SZT',
    category: 'CTF' as const,
    message: 'Decryption terminal nodes deployed in 5 community sectors. Awaiting field agent uplink.',
    level: 'info' as const
  }
];
