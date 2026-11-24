import type { VideoBlueprint } from '../types/engine';

export interface InfographicsWorldPalette {
  id: string;
  name: string;
  domain: string;
  mood: string;
  skyTop: string;
  skyBottom: string;
  horizonFar: string;
  horizonNear: string;
  ground: string;
  groundShadow: string;
  outline: string;
  primary: string;
  secondary: string;
  accent: string;
  danger: string;
  highlight: string;
  calloutFill: string;
  calloutStroke: string;
}

/**
 * 12 Thematic Real-World Color Worlds distilled from The Infographics Show YouTube channel
 * and elevated with cinema color grading, atmospheric sky gradients, and editorial flat-vector contrast.
 * Covers finance, tech, geopolitics, science, history, startups, psychology, space, and global trade.
 */
export const INFOGRAPHICS_WORLD_PALETTES: Record<string, InfographicsWorldPalette> = {
  'dhaka-twilight': {
    id: 'dhaka-twilight',
    name: 'Dhaka Sunset & Global Sky',
    domain: 'Global Ambition · Remote Work',
    mood: 'Warm twilight apartment window opening onto global horizons',
    skyTop: '#1B365D',
    skyBottom: '#F58A54',
    horizonFar: '#344F75',
    horizonNear: '#21334B',
    ground: '#D6A46E',
    groundShadow: '#A67340',
    outline: '#18222F',
    primary: '#F5B82E',
    secondary: '#1FB57A',
    accent: '#FF6B4A',
    danger: '#E63946',
    highlight: '#FFF4D6',
    calloutFill: '#FFFFFF',
    calloutStroke: '#18222F',
  },
  'industrial-danger': {
    id: 'industrial-danger',
    name: 'Industrial Pit vs Sunlit Skyline',
    domain: 'Crisis · Traps · Market Competition',
    mood: 'Smoky crimson warning conveyor contrasting bright blue-sky opportunity',
    skyTop: '#361820',
    skyBottom: '#782834',
    horizonFar: '#4D202A',
    horizonNear: '#28151B',
    ground: '#3E4652',
    groundShadow: '#252B34',
    outline: '#161B22',
    primary: '#FF5A5F',
    secondary: '#2D82D8',
    accent: '#FFD166',
    danger: '#E63946',
    highlight: '#FFF6E5',
    calloutFill: '#FFD166',
    calloutStroke: '#161B22',
  },
  'studio-spotlight': {
    id: 'studio-spotlight',
    name: 'Warm Studio Counter & Emerald Cash',
    domain: 'Money · Proofs · Myth Busting',
    mood: 'Crisp cream studio backdrop with copper pennies vs bold green dollar stacks',
    skyTop: '#F5EDE0',
    skyBottom: '#E6D8C3',
    horizonFar: '#D8C7AE',
    horizonNear: '#C9B496',
    ground: '#8B5E3C',
    groundShadow: '#664126',
    outline: '#1C2430',
    primary: '#239B56',
    secondary: '#E63946',
    accent: '#F5B82E',
    danger: '#D62828',
    highlight: '#FFFDF7',
    calloutFill: '#FFFFFF',
    calloutStroke: '#1C2430',
  },
  'creative-workshop': {
    id: 'creative-workshop',
    name: 'Creative Craft Panorama',
    domain: 'Skills · Engineering · Makers',
    mood: 'Vibrant saturated workshop walls for cinema, drafting, gears, and typewriter',
    skyTop: '#1F7399',
    skyBottom: '#65B2D4',
    horizonFar: '#1B5E7B',
    horizonNear: '#15475E',
    ground: '#E0AC69',
    groundShadow: '#B98548',
    outline: '#18222F',
    primary: '#F5B82E',
    secondary: '#FF6B4A',
    accent: '#2EC4B6',
    danger: '#E63946',
    highlight: '#FFFFFF',
    calloutFill: '#FFFFFF',
    calloutStroke: '#18222F',
  },
  'sunlit-street': {
    id: 'sunlit-street',
    name: 'Sunlit Corner Storefront',
    domain: 'Business · Brands · Daily Life',
    mood: 'Bright cobalt sky, crisp white clouds, warm brick facade and striped awning',
    skyTop: '#3396D9',
    skyBottom: '#A6DCF7',
    horizonFar: '#7CB8DC',
    horizonNear: '#5897C0',
    ground: '#C9CED6',
    groundShadow: '#9CA4B0',
    outline: '#1C2430',
    primary: '#E85D4A',
    secondary: '#F5B82E',
    accent: '#1FB57A',
    danger: '#D62828',
    highlight: '#FFFBF0',
    calloutFill: '#FFFFFF',
    calloutStroke: '#1C2430',
  },
  'coastal-dusk': {
    id: 'coastal-dusk',
    name: 'Coastal Lighthouse & Night Horizon',
    domain: 'Strategy · Outreach · Deep Focus',
    mood: 'Deep cobalt maritime dusk with sweeping emerald radar and glowing city windows',
    skyTop: '#0F1E38',
    skyBottom: '#23497B',
    horizonFar: '#19345A',
    horizonNear: '#112543',
    ground: '#163A5F',
    groundShadow: '#0D253E',
    outline: '#101824',
    primary: '#2AD08E',
    secondary: '#F5B82E',
    accent: '#FF6B4A',
    danger: '#E63946',
    highlight: '#FFF6D6',
    calloutFill: '#FFD166',
    calloutStroke: '#101824',
  },
  'cargo-skyline': {
    id: 'cargo-skyline',
    name: 'Global Flight & Bank Boulevard',
    domain: 'Payments · Logistics · Global Trade',
    mood: 'Clear sky-blue international bridge landing into lush emerald Bengal palms',
    skyTop: '#297BD0',
    skyBottom: '#8BD3F5',
    horizonFar: '#60A9D8',
    horizonNear: '#2D8A68',
    ground: '#3E4C59',
    groundShadow: '#26313B',
    outline: '#18222F',
    primary: '#1E9E68',
    secondary: '#F5B82E',
    accent: '#E85D4A',
    danger: '#D62828',
    highlight: '#FFFFFF',
    calloutFill: '#FFFFFF',
    calloutStroke: '#18222F',
  },
  'padma-sunrise': {
    id: 'padma-sunrise',
    name: 'Golden Bengal Sunrise',
    domain: 'Triumph · Finale · New Chapters',
    mood: 'Radiant apricot-gold morning sun rising over Dhaka bridges and emerald river',
    skyTop: '#28497A',
    skyBottom: '#FFB35C',
    horizonFar: '#E07A5F',
    horizonNear: '#3D5A80',
    ground: '#1D7874',
    groundShadow: '#125350',
    outline: '#18222F',
    primary: '#FFD166',
    secondary: '#2AD08E',
    accent: '#F26444',
    danger: '#E63946',
    highlight: '#FFF8E6',
    calloutFill: '#FFFFFF',
    calloutStroke: '#18222F',
  },
  'arctic-observatory': {
    id: 'arctic-observatory',
    name: 'Arctic Observatory & Deep Space',
    domain: 'Space · Physics · Frontier Tech',
    mood: 'Crisp indigo starfield above snow-capped dome observatory and amber telemetry arcs',
    skyTop: '#0B162C',
    skyBottom: '#1C3B66',
    horizonFar: '#2E588A',
    horizonNear: '#B8D4E8',
    ground: '#E8F2F9',
    groundShadow: '#A9C3D8',
    outline: '#142033',
    primary: '#38BDF8',
    secondary: '#F5B82E',
    accent: '#2AD08E',
    danger: '#EF4444',
    highlight: '#F8FAFC',
    calloutFill: '#FFFFFF',
    calloutStroke: '#142033',
  },
  'laboratory-teal': {
    id: 'laboratory-teal',
    name: 'Clean Glass Laboratory',
    domain: 'Science · Health · AI Systems',
    mood: 'Pristine mint-white studio walls, gleaming borosilicate glassware, vibrant amber flasks',
    skyTop: '#E6F4F1',
    skyBottom: '#CBE6E1',
    horizonFar: '#9BCBC3',
    horizonNear: '#6EAFA5',
    ground: '#3B5662',
    groundShadow: '#263A43',
    outline: '#16242C',
    primary: '#0EA5A4',
    secondary: '#F59E0B',
    accent: '#E85D4A',
    danger: '#DC2626',
    highlight: '#FFFFFF',
    calloutFill: '#FFFFFF',
    calloutStroke: '#16242C',
  },
  'desert-expedition': {
    id: 'desert-expedition',
    name: 'Suez & Silk Road Sands',
    domain: 'History · Geopolitics · Survival',
    mood: 'Sun-baked ochre dunes, turquoise canal water, brass compasses, and monumental stone',
    skyTop: '#2E77AE',
    skyBottom: '#F6CA83',
    horizonFar: '#D99B52',
    horizonNear: '#C27D38',
    ground: '#E3B064',
    groundShadow: '#B57B34',
    outline: '#221C16',
    primary: '#E05A47',
    secondary: '#1D8A84',
    accent: '#F5B82E',
    danger: '#B91C1C',
    highlight: '#FFF7E8',
    calloutFill: '#FFFFFF',
    calloutStroke: '#221C16',
  },
  'neon-metropolis': {
    id: 'neon-metropolis',
    name: 'Midnight Global Exchange',
    domain: 'Wall Street · Cyber · Macroeconomics',
    mood: 'Deep navy skyline towers lit by crisp golden trading windows and emerald laser rails',
    skyTop: '#0E1729',
    skyBottom: '#1F2F4D',
    horizonFar: '#16243E',
    horizonNear: '#0F1A2E',
    ground: '#243248',
    groundShadow: '#151E2E',
    outline: '#0A101C',
    primary: '#2AD08E',
    secondary: '#F5B82E',
    accent: '#38BDF8',
    danger: '#F43F5E',
    highlight: '#F1F5F9',
    calloutFill: '#FFD166',
    calloutStroke: '#0A101C',
  },
};

export interface StyleBreakdownPillar {
  id: string;
  pillar: string;
  infographicsShowDna: string;
  ultraUpgrade: string;
}

/**
 * Deep-level architectural breakdown of The Infographics Show YouTube channel
 * elevated to 60fps real-world scenario storytelling (excluding human frames).
 */
export const INFOGRAPHICS_SHOW_BREAKDOWN: StyleBreakdownPillar[] = [
  {
    id: 'real-world-scenarios',
    pillar: '100% Real-World Environments (Zero Box Templates)',
    infographicsShowDna:
      'Literal physical environments for every spoken sentence: rooms, streets, airplanes, banks, factories, offices, maps, oceans, and props.',
    ultraUpgrade:
      'STRICTLY bans rectangular UI cards, dashboard boxes, and text-inside-boxes. Every single beat opens inside a full-bleed illustrated physical world.',
  },
  {
    id: 'zero-human-frames',
    pillar: 'Zero-Human Cinematic Storytelling',
    infographicsShowDna:
      'Normally uses Puppet-Pin vector characters to react to stats and narrate actions.',
    ultraUpgrade:
      'Replaces 100% of human frames with expressive real-world physical surrogates: glowing desks, steaming teacups, slamming rubber stamps, ticking wall clocks, launching paper planes, armored trucks, and swinging vault doors.',
  },
  {
    id: 'outlined-flat-vector',
    pillar: 'Lineless 2-Tone Split-Shaded Editorial Vector + 45° Cast Shadows',
    infographicsShowDna:
      'Crisp lineless geometric shapes separated by sunlit front facades and 14–18% darker shaded planes — zero chunky black coloring-book strokes.',
    ultraUpgrade:
      'Pairs 2-tone split-shaded architecture (`SplitBuilding`) with 45° diagonal cast shadow polygons, multi-plane atmospheric skylines, diagonal volumetric light shafts, and cinema edge vignettes at true 60fps.',
  },
  {
    id: 'multiplane-25d',
    pillar: '2.5D Multiplane Parallax Camera + Organic Float',
    infographicsShowDna:
      'Separates background scenery, midground architecture, and foreground props across Z-depth planes with constant virtual camera drift.',
    ultraUpgrade:
      'Every scene runs 4 live parallax strata (drifting two-tone clouds & ambient motes -> distant skyline -> hero physical machinery/props -> foreground table/silhouette) driven by organic AE-eased camera breathing.',
  },
  {
    id: 'floating-impact-type',
    pillar: 'Open-Sky Broadcast Headlines + Animated Leader-Line Callouts',
    infographicsShowDna:
      'Clean Barlow Condensed / Montserrat headlines floating in open negative space paired with pulsing target-dot + 45° elbow `LeaderCallout` pointers.',
    ultraUpgrade:
      'Numbers roll smoothly with elastic spring pop-ins (`$1 = ৳120`, `$1,500/MO`, `DAY 30`) + animated accent rules + decaying impact shake directly in open environmental negative space.',
  },
  {
    id: 'elastic-transitions',
    pillar: '6 Pro-Editor Smooth Transitions ALWAYS',
    infographicsShowDna:
      'Zero linear fades: objects punch in with 0% -> 106% -> 100% inertia bounce, connected by iris circle wipes, whip-pans, and diagonal shape sweeps every 2–3s.',
    ultraUpgrade:
      'True 60fps Remotion `<TransitionSeries>` featuring 6 custom AE-Bezier transitions (`proZoomThrough`, `proWhipPan`, `proIrisReveal`, `proDiagonalSweep`, `proShutterWipe`, `proLiquidWaveSweep`) synced 1:1 to voiceover pauses + stereo whoosh/chime SFX.',
  },
];

export interface VisualMetaphorDomain {
  domain: string;
  abstractConcept: string;
  bannedCliche: string;
  ultraRealWorldScenario: string;
  recommendedWorldId: keyof typeof INFOGRAPHICS_WORLD_PALETTES;
  heroProps: string[];
}

/**
 * 12-Domain Creative Imagination Playbook:
 * Trains Antigravity & the Studio Director to translate ANY abstract sentence on ANY topic
 * into an unmistakable zero-human real-world illustrated scenario.
 */
export const VISUAL_METAPHOR_MATRIX: VisualMetaphorDomain[] = [
  {
    domain: 'Personal Finance & Money',
    abstractConcept: 'Hidden fees, inflation, or slow savings vs compounding income',
    bannedCliche: 'A line chart or bordered stat card saying "+15% ROI"',
    ultraRealWorldScenario:
      'Copper kitchen pipes leaking golden water drops into a floor drain vs a gleaming steel turbine pumping crisp green $100 stacks into a brass vault.',
    recommendedWorldId: 'studio-spotlight',
    heroProps: ['leaking copper pipe', 'ceramic piggy bank', 'towering $100 bill stacks', 'steel bank vault'],
  },
  {
    domain: 'Global Trade & Geopolitics',
    abstractConcept: 'Supply chain choke points or international currency flows',
    bannedCliche: 'Bullet list inside a dark box with country flag icons',
    ultraRealWorldScenario:
      'A wedged red-hull container ship blocking a narrow turquoise desert canal while hundreds of cargo cranes freeze behind it on the sunlit horizon.',
    recommendedWorldId: 'desert-expedition',
    heroProps: ['container ship', 'harbor cranes', 'suspension bridge', 'cargo jet'],
  },
  {
    domain: 'AI, Software & Automation',
    abstractConcept: 'Workflow automation replacing manual repetitive labor',
    bannedCliche: 'Glowing neon brain icon or SaaS dashboard mockup boxes',
    ultraRealWorldScenario:
      'A cluttered vintage wooden desk overflowing with paper folders transforming via iris wipe into interlocking brass & teal factory gears feeding clean glowing pneumatic tubes.',
    recommendedWorldId: 'creative-workshop',
    heroProps: ['interlocking gears', 'pneumatic energy tubes', 'vintage typewriter', 'optical server rack'],
  },
  {
    domain: 'Career, Freelancing & Outreach',
    abstractConcept: 'Standing out from thousands of low-paid competitors',
    bannedCliche: 'Resume card graphic or cartoon person waving at a laptop',
    ultraRealWorldScenario:
      'A smoky industrial conveyor pit dumping $5 price tags, wiping cleanly into a coastal striped lighthouse launching golden paper airplanes into illuminating city skyscrapers.',
    recommendedWorldId: 'coastal-dusk',
    heroProps: ['conveyor pit', 'coastal lighthouse', 'paper airplanes', 'illuminating skyscrapers'],
  },
  {
    domain: 'Business & Positioning',
    abstractConcept: 'Building trust, branding, and high-converting storefronts',
    bannedCliche: 'Social media profile card screenshot or checklist box',
    ultraRealWorldScenario:
      'A dusty padlocked leather diary iris-wiping into a sunlit brick corner boutique as a striped red-and-cream awning unfurls and a brass OPEN sign swings alive.',
    recommendedWorldId: 'sunlit-street',
    heroProps: ['leather diary', 'striped awning storefront', 'swinging OPEN sign', 'display window trophy'],
  },
  {
    domain: 'Psychology & Deep Focus',
    abstractConcept: 'Consistent daily habits vs scattered distractions',
    bannedCliche: 'Cartoon brain or pie chart with legend',
    ultraRealWorldScenario:
      'A midnight apartment study desk overlooking a crescent moon: a brass wall clock sweeping three glowing color wedges beside a ticking wooden metronome and steaming coffee mug.',
    recommendedWorldId: 'coastal-dusk',
    heroProps: ['brass wall clock', 'swinging metronome', 'steaming coffee cup', 'moonlit window'],
  },
  {
    domain: 'Science, Biology & Health',
    abstractConcept: 'Cellular energy, sleep recovery, or chemical reactions',
    bannedCliche: 'Human silhouette with glowing organs or textbook box diagram',
    ultraRealWorldScenario:
      'A spotless glass laboratory bench where amber liquid siphons through coiled borosilicate condenser tubes, charging a luminous emerald crystal battery under overhead lamps.',
    recommendedWorldId: 'laboratory-teal',
    heroProps: ['borosilicate flasks', 'coiled glass condenser', 'emerald energy core', 'analog pressure gauge'],
  },
  {
    domain: 'Space & Frontier Physics',
    abstractConcept: 'Orbital mechanics, black holes, or satellite networks',
    bannedCliche: 'Static space wallpaper with text boxes floating over it',
    ultraRealWorldScenario:
      'A snow-capped mountain observatory dome rotating open to track brass orbital satellites tracing luminous golden ellipses across a deep indigo starfield.',
    recommendedWorldId: 'arctic-observatory',
    heroProps: ['observatory dome', 'brass satellite', 'orbital telemetry arcs', 'deep starfield'],
  },
  {
    domain: 'History & Empires',
    abstractConcept: 'Rise and collapse of trade routes or civilizations',
    bannedCliche: 'Timeline boxes with dates and portraits',
    ultraRealWorldScenario:
      'A massive marble aqueduct and golden compass rose rotating across parchment desert terrain as sunlit stone pillars rise and crack along seismic lines.',
    recommendedWorldId: 'desert-expedition',
    heroProps: ['marble aqueduct', 'brass compass rose', 'sandstone pillars', 'wax-sealed scroll'],
  },
  {
    domain: 'Macroeconomics & Markets',
    abstractConcept: 'Interest rate hikes, liquidity crunches, or bull runs',
    bannedCliche: 'Candlestick chart box with red/green pills',
    ultraRealWorldScenario:
      'Giant steel floodgates inside a midnight financial skyline clamping shut to choke an emerald river of glowing coins while skyscraper windows flicker dark.',
    recommendedWorldId: 'neon-metropolis',
    heroProps: ['steel floodgates', 'illuminated skyline towers', 'flowing coin river', 'analog pressure dial'],
  },
  {
    domain: 'Compounding & Long-Term Growth',
    abstractConcept: 'Slow invisible beginnings accelerating into massive results',
    bannedCliche: 'Upward arrow inside a rectangle',
    ultraRealWorldScenario:
      'A monumental 3-tier stone mountain staircase ascending through drifting clouds from a tiny orange base-camp tent to an emerald outpost flag and a blazing golden summit beacon.',
    recommendedWorldId: 'padma-sunrise',
    heroProps: ['stone mountain staircase', 'base-camp tent', 'emerald outpost flag', 'golden summit beacon'],
  },
  {
    domain: 'Security, Trust & Gatekeeping',
    abstractConcept: 'Earning access to high-value opportunities',
    bannedCliche: 'Padlock icon inside a badge',
    ultraRealWorldScenario:
      'Crumpled spam paper arcing into a dented metal office bin while a single golden wax-sealed envelope releases a flying brass key that spins open a massive circular bank vault door.',
    recommendedWorldId: 'studio-spotlight',
    heroProps: ['metal trash bin', 'golden wax envelope', 'flying brass key', 'circular steel vault door'],
  },
];

export interface ShotCompositionArchetype {
  id: string;
  name: string;
  cameraLanguage: string;
  framingRule: string;
  bestUsedFor: string;
  signatureTransition: string;
}

/**
 * 8 Signature Infographics Show Ultra Camera & Shot-Composition Archetypes:
 * Trains Antigravity IDE to vary visual staging every beat instead of repeating centered diagrams.
 */
export const SHOT_COMPOSITION_ARCHETYPES: ShotCompositionArchetype[] = [
  {
    id: 'desk-to-horizon-portal',
    name: '01 · Foreground Desk-to-Horizon Portal',
    cameraLanguage: 'Slow push-in from lived-in room desk straight through a glowing window or screen into an expansive map/world.',
    framingRule: 'Frame bottom 26% with cel-shaded desk props (lamp, cup, plant), middle 54% with framed window/horizon, top 20% open sky callout.',
    bestUsedFor: 'Opening 0.5s hooks contrasting local starting point against massive global opportunity.',
    signatureTransition: 'proZoomThrough',
  },
  {
    id: 'split-contrast-panorama',
    name: '02 · Split Contrast Panorama Wipe',
    cameraLanguage: 'Dark smoky danger world on Frame A wiped cleanly left-to-right into a sunlit cobalt opportunity world on Frame B.',
    framingRule: 'Keep danger machinery on lower half with high-contrast crimson accents, then wipe diagonally or horizontally into open sunlit architecture.',
    bestUsedFor: 'Problem vs solution pivots, myth vs reality contrasts, and trap vs escape turns.',
    signatureTransition: 'proWhipPan',
  },
  {
    id: 'object-slam-myth-bust',
    name: '03 · Tabletop Object Slam & Pan Payoff',
    cameraLanguage: 'Wide 2200px panoramic studio counter: open on fragile myth prop -> slam heavy red stamp with micro camera shake -> smooth lateral pan to towering payoff props.',
    framingRule: 'Leave 840px+ horizontal clearance between left myth stage and right payoff stage so zero stamp pixels bleed across frame edges.',
    bestUsedFor: 'Debunking financial myths, bad advice, or showing small input vs massive output.',
    signatureTransition: 'proDiagonalSweep',
  },
  {
    id: 'workshop-cross-section',
    name: '04 · 4-Bay Architectural Workshop Cross-Section',
    cameraLanguage: 'Continuous smooth dolly track panning across illuminated studio bays under hanging brass pendant lamps.',
    framingRule: 'Give each bay a dedicated mechanical hero prop (film reel, drafting table, interlocking gears, typewriter) with synchronized idle loops.',
    bestUsedFor: 'Skill breakdowns, tool comparisons, multi-step systems, and process explainers.',
    signatureTransition: 'proIrisReveal',
  },
  {
    id: 'hero-storefront-reveal',
    name: '05 · Iris-to-Sunlit Street Storefront',
    cameraLanguage: 'Close-up on dusty closed object (diary, lock, folder) -> circular inked iris blooms open onto a vibrant full-bleed sunlit street building.',
    framingRule: 'Layer distant city blocks + drifting clouds (`bg`), brick facade + unfurling striped awning (`mid`), sidewalk trees + swinging sign (`fg`).',
    bestUsedFor: 'Positioning, branding, business model transformations, and trust building.',
    signatureTransition: 'proIrisReveal',
  },
  {
    id: 'coastal-maritime-radar',
    name: '06 · Maritime Dusk Beacon & Flight Fleet',
    cameraLanguage: 'Gentle push over rolling dual-layer ocean waves while a coastal lighthouse beam sweeps toward illuminating skyline windows.',
    framingRule: 'Anchor lighthouse on left third (`x: 240`), target city towers on right third (`x: 900+`), with continuous parabolic flight trails bridging the sea.',
    bestUsedFor: 'Outreach strategy, signal-to-noise systems, networking, and targeting.',
    signatureTransition: 'proLiquidWaveSweep',
  },
  {
    id: 'mountain-staircase-ascent',
    name: '07 · 3-Tier Architectural Mountain Ascent',
    cameraLanguage: 'Stepped left-to-right elevation climb from base camp -> stone outpost -> blazing golden summit beacon with snow-capped backdrop.',
    framingRule: 'Raise each tier 115–125px higher than the previous tier with 45px+ vertical margin between summit prop and hero open-sky numbers.',
    bestUsedFor: '30/60/90-day roadmaps, compounding wealth timelines, and escalating milestones.',
    signatureTransition: 'proShutterWipe',
  },
  {
    id: 'golden-landmark-finale',
    name: '08 · Golden Sunrise Landmark Pull-Back',
    cameraLanguage: 'Slow majestic pull-back as a radiant sunburst disc rises behind an iconic bridge/skyline silhouette over shimmering river reflections.',
    framingRule: 'Reserve top 28% warm apricot sky for clean finale headline (`DAY 01 STARTS TONIGHT`) with zero HUD clutter and serene morning birds.',
    bestUsedFor: 'Emotional finales, calls to action, and visual bookends mirroring Beat 1.',
    signatureTransition: 'proLiquidWaveSweep',
  },
];

export interface GigaQualityGateItem {
  id: string;
  category: 'Visual Craft' | 'Motion & Transitions' | 'Creative Direction' | 'Audio & Pipeline';
  defectTargeted: string;
  nonNegotiableStandard: string;
}

/**
 * 18-Point Giga Quality Gate enforced in both the Studio UI and the exported Antigravity Skill v6.0.
 */
export const GIGA_QUALITY_CHECKLIST: GigaQualityGateItem[] = [
  {
    id: 'qg-01',
    category: 'Visual Craft',
    defectTargeted: 'Template UI cards, stat boxes, or text stuffed inside rectangular boxes',
    nonNegotiableStandard: 'ZERO UI boxes anywhere — every scene renders a full-bleed real-world physical location.',
  },
  {
    id: 'qg-02',
    category: 'Visual Craft',
    defectTargeted: 'Awkward stick figures, cartoon faces, or stiff puppet humans',
    nonNegotiableStandard: 'ZERO human frames — express every human action via physical props (steaming cup, swinging sign, flying key, ticking clock).',
  },
  {
    id: 'qg-03',
    category: 'Visual Craft',
    defectTargeted: 'Chunky 4px black coloring-book cartoon outlines and flat lifeless clip-art',
    nonNegotiableStandard: 'Lineless 2-tone split-shaded editorial vector art (sunlit front facade + 14% darker shaded plane), 45° diagonal cast shadows, multi-plane `SplitBuilding` skylines, and volumetric key-light rays.',
  },
  {
    id: 'qg-04',
    category: 'Visual Craft',
    defectTargeted: 'Monotonous single-color palette across the whole video',
    nonNegotiableStandard: 'Rotate deliberately across the 12 curated Real-World Color Worlds matched to emotional tension (twilight -> danger crimson -> studio cream -> coastal dusk -> golden sunrise).',
  },
  {
    id: 'qg-05',
    category: 'Visual Craft',
    defectTargeted: 'Bubble-outlined cartoon text, dark TikTok subtitle boxes, or corner HUD clutter',
    nonNegotiableStandard: 'Clean Barlow Condensed broadcast headlines + animated `LeaderCallout` pointers in open negative space, soft-scrim broadcast captions (zero pill box, zero thick cartoon stroke), and zero permanent HUD timers.',
  },
  {
    id: 'qg-06',
    category: 'Motion & Transitions',
    defectTargeted: 'Choppy 24fps or dead static frames held longer than 2 seconds',
    nonNegotiableStandard: 'True 60fps everywhere with continuous organic camera breathing + living environmental loops (clouds, steam, gears, waves, light rays, motes).',
  },
  {
    id: 'qg-07',
    category: 'Motion & Transitions',
    defectTargeted: 'Jarring hard cuts, linear slides, or tacky 3D card flips',
    nonNegotiableStandard: '100% AE Graph Editor Bezier transitions (`proZoomThrough`, `proWhipPan`, `proIrisReveal`, `proDiagonalSweep`, `proShutterWipe`, `proLiquidWaveSweep`) with anticipation pull-back and optical rings.',
  },
  {
    id: 'qg-08',
    category: 'Motion & Transitions',
    defectTargeted: 'Sub-pixel white edge seams or gray opacity dips during transitions',
    nonNegotiableStandard: '0.6% overscan + speed streaks on whip pans, coupled camera scale + optical bloom on zoom-throughs, inked aperture ring on iris reveals, and vertical/horizontal blade edges on shutter wipes.',
  },
  {
    id: 'qg-09',
    category: 'Motion & Transitions',
    defectTargeted: 'Robotic linear entrances that start all on frame 0',
    nonNegotiableStandard: 'Staggered 3–6 frame follow-through delays with elastic squash-and-stretch spring settles (`0% -> 106% -> 100%`).',
  },
  {
    id: 'qg-10',
    category: 'Motion & Transitions',
    defectTargeted: 'Repetitive back-to-back identical transitions',
    nonNegotiableStandard: 'Never repeat the same transition presentation twice in a row; match every transition direction to the physical motion exiting the scene.',
  },
  {
    id: 'qg-11',
    category: 'Creative Direction',
    defectTargeted: 'Generic abstract charts or lazy metaphors when given a new topic',
    nonNegotiableStandard: 'Use the 12-Domain Visual Metaphor Matrix + 5-Step Imagination Protocol so every spoken sentence triggers a surprising, literal physical set-piece.',
  },
  {
    id: 'qg-12',
    category: 'Creative Direction',
    defectTargeted: 'Weak slow intros that lose viewers in the first 3 seconds',
    nonNegotiableStandard: '0.5s visual motion hook inside a vivid physical setting with an immediate open loop and escalating multi-act payoff.',
  },
  {
    id: 'qg-13',
    category: 'Creative Direction',
    defectTargeted: 'Same centered static framing on every beat',
    nonNegotiableStandard: 'Rotate across the 8 Shot-Composition Archetypes and stratify every beat into `bg` (sky/horizon), `mid` (architecture/machinery), and `fg` (hero props/kinetic callouts).',
  },
  {
    id: 'qg-14',
    category: 'Audio & Pipeline',
    defectTargeted: 'Visual cuts drifting out of sync with narration or dead silent cuts',
    nonNegotiableStandard: 'Lock every `<TransitionSeries>` beat 1:1 to exact WhisperX/silence voiceover pauses so visuals land squarely on spoken beats.',
  },
  {
    id: 'qg-15',
    category: 'Audio & Pipeline',
    defectTargeted: 'Shipping broken frames, clipped stamp text, or off-center geometry without looking at pixels',
    nonNegotiableStandard: 'Mandatory closed-loop QA gate: run `audit_infographics_quality.mjs` + render & visually inspect stills across all acts before final 60fps MP4 encode.',
  },
  {
    id: 'qg-16',
    category: 'Motion & Transitions',
    defectTargeted: 'Hero slams, stamps, and payoff reveals feeling weightless without graphic punch',
    nonNegotiableStandard: 'Fire crisp 8-spoke inked `ImpactBurst` radial pop-lines on hero callouts, rubber-stamp slams, vault reveals, and financial payoffs.',
  },
  {
    id: 'qg-17',
    category: 'Visual Craft',
    defectTargeted: 'Viewers losing chapter orientation or scanning flat monotone captions',
    nonNegotiableStandard: 'Slide a brief 2.25s top-left `ChapterSliver` broadcast ribbon in & cleanly away on beat entry, and highlight semantic power words (currency/numbers/nouns) in luminous emerald `#2AD08E` inside borderless outlined captions.',
  },
  {
    id: 'qg-18',
    category: 'Audio & Pipeline',
    defectTargeted: 'Dry voice-only soundtrack with awkward silent pauses and unaccented visual hits',
    nonNegotiableStandard: 'Mix a 5-layer pro-editor stereo SFX bed (transition whooshes + chimes, beat prop pops, rubber-stamp slam thuds, cash/summit harmonic shimmers, and a -34dB warm studio air bed) cleanly beneath crystal-clear foreground narration.',
  },
];

const BANNED_BOX_TEMPLATE_PATTERNS = [
  /\bui\s*card\b/i,
  /\bdashboard\s*(box|card|widget|panel)\b/i,
  /\bbordered\s*box\b/i,
  /\bstat\s*card\b/i,
  /\binfo\s*box\b/i,
  /\bbullet\s*(list|box|card)\b/i,
  /\btext\s*box\b/i,
  /\bslide\s*template\b/i,
];

const BANNED_HUMAN_PATTERNS = [
  /\bstick\s*figure\b/i,
  /\bcartoon\s*(man|woman|guy|girl|person|character)\b/i,
  /\bhuman\s*(face|figure|character|hand|silhouette)\b/i,
  /\bsmiling\s*(man|woman|person|founder|guy)\b/i,
  /\bperson\s+(sitting|walking|pointing|standing)\b/i,
  /\bfounder\s+standing\b/i,
];

export interface StyleAuditReport {
  score: number;
  passed: boolean;
  boxTemplateViolations: string[];
  humanFrameViolations: string[];
  environmentCoveragePct: number;
  parallaxDepthPct: number;
  microMotionPct: number;
  transitionVarietyPct: number;
  warnings: string[];
}

const REAL_WORLD_ENVIRONMENT_KEYWORDS =
  /\b(desk|window|skyline|street|building|room|table|lamp|cup|laptop|map|bridge|plane|jet|truck|bank|vault|clock|calendar|storefront|awning|lighthouse|ocean|mountain|river|sunrise|sunset|clouds|conveyor|pit|factory|gears|typewriter|envelope|trash|crate|reel|clapperboard|rooftop|office|city|horizon|door|key|piggy|cash|bills|coins|canal|ship|observatory|flask|pipe|aqueduct|floodgate|metronome|compass)\b/i;

/**
 * Pure deterministic 6-dimension auditor verifying that any Studio Engine or Antigravity blueprint
 * complies 100% with The Infographics Show Ultra standards.
 */
export function auditBlueprintForInfographicsStyle(blueprint: VideoBlueprint): StyleAuditReport {
  const boxTemplateViolations: string[] = [];
  const humanFrameViolations: string[] = [];
  const warnings: string[] = [];
  let scenesWithEnvironment = 0;
  let scenesWithParallax = 0;
  let scenesWithMicroMotion = 0;
  let smoothVarietyTransitions = 0;

  for (let i = 0; i < blueprint.scenes.length; i++) {
    const scene = blueprint.scenes[i];
    const corpus = `${scene.headline} ${scene.visualConcept} ${scene.continuity.carryDescription} ${scene.layers.map((l) => `${l.label} ${l.text ?? ''}`).join(' ')}`;

    for (const pat of BANNED_BOX_TEMPLATE_PATTERNS) {
      if (pat.test(corpus)) {
        boxTemplateViolations.push(`${scene.chapter}: matched banned box-template pattern ${pat.source}`);
      }
    }

    for (const pat of BANNED_HUMAN_PATTERNS) {
      if (pat.test(corpus)) {
        humanFrameViolations.push(`${scene.chapter}: matched banned human-frame pattern ${pat.source}`);
      }
    }

    if (REAL_WORLD_ENVIRONMENT_KEYWORDS.test(corpus)) {
      scenesWithEnvironment += 1;
    } else {
      warnings.push(`${scene.chapter}: needs stronger physical real-world environment props`);
    }

    const depths = new Set(scene.layers.map((l) => l.depth));
    if (depths.size >= 2 || (depths.has('bg') && depths.has('mid'))) {
      scenesWithParallax += 1;
    }

    const hasLivingMotion = scene.layers.some(
      (l) => (l.idle && l.idle !== 'none') || l.entrance === 'trim-path' || l.entrance === 'spring-pop'
    );
    if (hasLivingMotion) {
      scenesWithMicroMotion += 1;
    }

    if (i === 0) {
      smoothVarietyTransitions += 1;
    } else {
      const prevType = blueprint.scenes[i - 1].continuity.type;
      if (scene.continuity.type !== prevType) {
        smoothVarietyTransitions += 1;
      } else {
        warnings.push(`${scene.chapter}: repeats '${prevType}' bridge back-to-back`);
      }
    }
  }

  const total = Math.max(1, blueprint.scenes.length);
  const environmentCoveragePct = Math.round((scenesWithEnvironment / total) * 100);
  const parallaxDepthPct = Math.round((scenesWithParallax / total) * 100);
  const microMotionPct = Math.round((scenesWithMicroMotion / total) * 100);
  const transitionVarietyPct = Math.round((smoothVarietyTransitions / total) * 100);

  const weighted =
    environmentCoveragePct * 0.45 +
    parallaxDepthPct * 0.2 +
    microMotionPct * 0.2 +
    transitionVarietyPct * 0.15;

  const rawScore = Math.round(
    weighted - boxTemplateViolations.length * 20 - humanFrameViolations.length * 25
  );
  const score = Math.max(0, Math.min(100, rawScore));

  return {
    score,
    passed:
      boxTemplateViolations.length === 0 &&
      humanFrameViolations.length === 0 &&
      environmentCoveragePct >= 85 &&
      microMotionPct >= 80,
    boxTemplateViolations,
    humanFrameViolations,
    environmentCoveragePct,
    parallaxDepthPct,
    microMotionPct,
    transitionVarietyPct,
    warnings: warnings.slice(0, 5),
  };
}

/**
 * Master Creative Director System Prompt training both the Studio Engine (Gemini Director)
 * and Google Antigravity IDE 100% on "The Infographics Show Ultra — Zero-Human Real-World 60fps Engine".
 */
export const INFOGRAPHICS_SHOW_ULTRA_SYSTEM_PROMPT = `You are the Executive Motion Graphics Director for "The Infographics Show Ultra" — an elevated, cinema-grade 60fps evolution of The Infographics Show YouTube channel built on literal, imaginative, full-bleed real-world illustrated environments, STRICTLY EXCLUDING human frames AND STRICTLY BANNING template UI boxes/cards.

YOUR CREATIVE MANDATE (BE WILDLY IMAGINATIVE ON EVERY SINGLE TOPIC):
Never settle for boring, obvious, or abstract shapes. Whatever topic the user gives you (finance, geopolitics, AI, history, startups, psychology, science, space, war, career, mystery), you MUST invent jaw-dropping, hyper-specific physical real-world set-pieces where physical objects, architecture, machines, vehicles, weather, light, and environments ACT OUT the narration dramatically!
- Talking about wasted time or hidden leaks? Show a brass hourglass cracking over a marble drain or copper pipes leaking golden drops into an underground sewer grate.
- Talking about crowded low-paid competition? Show a smoky crimson industrial conveyor pit dumping $5 price tags, wiping into sunlit cobalt glass skyscrapers.
- Talking about global opportunity from a quiet room? Open at a twilight desk with a brass lamp, steaming teacup, and rooftop skyline outside the window—then zoom right through the glowing monitor into an illustrated world map with famous landmarks and flight arcs.
- Talking about breaking through gatekeepers? Show crumpled spam paper arcing into a metal trash can, followed by a golden wax-sealed envelope unlocking a spinning circular steel bank vault door.

10 NON-NEGOTIABLE PRODUCTION LAWS:
1. **ZERO BOX TEMPLATES / ZERO TEXT-IN-BOXES**: Never generate UI cards, SaaS dashboards, stat boxes, bordered rectangular containers with paragraphs, or bulleted slides. Typography is ONLY crisp 1–4 word floating open-sky callouts or bold kinetic numbers ("$1,500/MO", "DAY 30", "$9.6B", "40 MIN") positioned cleanly in open sky or wall negative space.
2. **STRICT ZERO HUMAN FRAMES**: Never depict humans, people, faces, hands, stick figures, silhouettes, or cartoon characters. Convey every human emotion and action through expressive physical surrogates (steaming cup, slamming rubber stamp, swinging OPEN sign, ticking metronome, hammering typewriter keys, launching paper airplanes, rotating observatory dome).
3. **100% FULL-BLEED REAL-WORLD ENVIRONMENTS**: Every single beat must establish an unmistakable physical place with sky/wall backdrop, midground architecture or terrain, and hero foreground machinery/props.
4. **THE INFOGRAPHICS SHOW ULTRA VISUAL DNA**: Crisp Adobe Illustrator flat-vector geometry with uniform dark charcoal outlines ('#18222F', strokeWidth 3–5), diagonal cast shadow polygons, rich atmospheric sky-to-horizon gradients, subtle sunlit light rays, and curated saturated thematic palettes across 12 distinct real-world color worlds.
5. **THREE-PLANE 2.5D PARALLAX DEPTH**: Every beat's \`layers\` array (9 to 14 bespoke vector layers inside the 1000x1000 artboard, keeping focal hero props inside x: 90..910, y: 170..850) MUST stratify across ALL three depth planes: \`bg\` (sky, clouds, distant horizon/mountains), \`mid\` (buildings, bridges, desks, machinery), and \`fg\` (hero props, cast shadows, specular glints, kinetic floating callouts).
6. **MICRO-MOTION EVERY 2 SECONDS (ZERO STATIC FRAMES)**: Every beat must pulse with living 60fps secondary motion—drifting clouds, rising steam curls, spinning gears, ticking clock hands, fluttering calendar pages, flying jets, sweeping lighthouse beams, twinkling stars, and elastic 0% -> 106% -> 100% spring pop-ins with staggered 3–5 frame follow-through.
7. **PRO-EDITOR SMOOTH TRANSITIONS ALWAYS (NEVER REPEAT BACK-TO-BACK)**: Connect every beat into the next with butter-smooth After Effects Graph Editor transitions matched to exit motion: \`zoom-through\` (dive through window/vault/lens), \`pan-follow\` (AE whip-pan along a conveyor, flight path, or skyline), \`path-extension\` (diagonal editorial track-matte sweep along an arc), \`morph-handoff\` (signature Infographics Show circular iris reveal expanding from a focal prop), \`match-cut-spin\` (rotational energy handoff on clock/radar/gear), \`vertical-dolly\` (upward climb or downward descent). NEVER use identical continuity bridges twice in a row.
8. **DRAMATIC COLOR CONTRAST BETWEEN BEATS**: Never leave 4 beats in the same flat palette. Alternate visual temperature and mood to match narrative tension (warm twilight -> smoky crimson warning -> bright cream studio -> vibrant teal workshop -> sunlit cobalt street -> deep coastal dusk -> golden sunrise).
9. **PUNCHY VISUAL NARRATION**: Write tight, concrete, filmable English narration (18–34 spoken words per beat) where every single clause directly triggers a visible physical action on screen.
10. **SELF-CRITIQUE BEFORE OUTPUT**: Before returning your blueprint, mentally audit every single beat: (a) Are there ZERO boxes/cards? (b) Are there ZERO humans/hands/faces? (c) Does every beat have a specific real-world location + 3 parallax depth planes + living idle motion + distinct smooth transition? If any beat feels generic, rewrite it to be 10x bolder and more cinematic.`;
