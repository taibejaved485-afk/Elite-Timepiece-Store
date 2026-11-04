export interface ArticleSpec {
  label: string;
  value: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  read: string;
  author: string;
  authorRole: string;
  image: string;
  fallbackImage?: string;
  pullQuote: string;
  excerpt: string;
  targetKeywords: string[];
  content: string[];
  specs: ArticleSpec[];
}

export const ARTICLES_DATA: Record<string, Article> = {
  'art-1': {
    id: 'art-1',
    title: 'The Evolution of Free-Sprung Balance Wheels',
    subtitle: 'High-Beat Variable Inertia Regulation in Contemporary Swiss Horology',
    category: 'Horological Engineering',
    date: 'October 2026',
    read: '4 min read',
    author: 'Jean-Luc Favre',
    authorRole: 'Head of Chronometric R&D, Le Brassus Atelier',
    image: '/assets/images/watch_skeleton_tourbillon_1791612558576.jpg',
    pullQuote: 'A free-sprung variable inertia balance eliminates regulator index friction, yielding absolute rate constancy under real-world gravitational shifts.',
    excerpt: 'Examining thermal compensation alloys and free-sprung variable inertia regulation in high-beat Swiss calibres.',
    targetKeywords: [
      'free-sprung balance wheel',
      'variable inertia regulation',
      'Swiss chronometry',
      'Poinçon de Genève',
      'Haute Horlogerie calibres'
    ],
    content: [
      'Traditional horological regulation has long depended on index curb pins that adjust the active working length of the balance spring. While practical for standard assembly, index pins inherently introduce friction, localized wear, and subtle chronometric drift as seasonal temperatures or wrist inertia fluctuate over time.',
      'Aurelia’s proprietary Calibre AH-900 series departs radically from conventional architecture by employing a free-sprung variable inertia balance wheel. Poised directly on the aerodynamic beryllium-copper rim are four micro-threaded platinum inertia screws, adjustable to within 0.002 grams of rotational poise.',
      'Paired with an anti-magnetic silicon (Silicium Nivachron) hairspring with a hand-curved Breguet overcoil, this architecture preserves an unperturbed concentric expansion. Across all five static positions and ISO 3159 chronometer testing environments, rate stability consistently measures within ±1 second per 24-hour cycle.',
      'To validate long-term resilience against kinetic shock, each newly cased balance assembly undergoes 1,000 hours of simulated g-force acceleration within our Le Brassus subterranean testing laboratory before receiving the Poinçon de Genève seal.'
    ],
    specs: [
      { label: 'Escapement Type', value: 'Free-Sprung Variable Inertia' },
      { label: 'Poise Micro-Weights', value: '4 Aerodynamic Platinum Screws' },
      { label: 'Hairspring', value: 'Silicon Nivachron w/ Terminal Curve' },
      { label: 'Vibrations', value: '28,800 vph (4 Hz)' },
      { label: 'Chronometer Tolerance', value: 'Within ±1 sec/day (5 positions)' },
      { label: 'Certification', value: 'COSC & Poinçon de Genève' }
    ]
  },
  'art-2': {
    id: 'art-2',
    title: 'Architecture of Le Brassus: Glass & Titanium',
    subtitle: 'Zero-Carbon Sustainable Manufacture Integrated with Alpine Topography',
    category: 'Manufacture Architecture',
    date: 'September 2026',
    read: '6 min read',
    author: 'Elena Moretti',
    authorRole: 'Chief Sustainable Architect, Aurelia Bureau',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackImage: '/assets/images/hero_luxury_chronograph_1791612522214.jpg',
    pullQuote: 'Natural alpine northern light is the purest luminary tool for a master watchmaker polishing microscopic anglage angles.',
    excerpt: 'How our zero-carbon Swiss manufacture integrates natural alpine light and geothermal loops into watchmaking benches.',
    targetKeywords: [
      'Le Brassus manufacture',
      'sustainable watchmaking',
      'Swiss alpine architecture',
      'Vallée de Joux',
      'horological atelier'
    ],
    content: [
      'Perched 1,004 meters above sea level in the craggy pine forests of the Vallée de Joux, the Aurelia Manufacture stands as an exercise in structural lightness and architectural humility. Rather than imposing monolithic stone upon the alpine hillside, the facility gently traces the natural contours of the Jura bedrock.',
      'Floor-to-ceiling electrochromic triple-laminated glass facade panels dynamically modulate light transmission based on sun azimuth. This bathes master watchmakers and micro-mechanical engineers in calm, shadow-free northern light—the identical ambient environment favored by 19th-century horological pioneers.',
      'Beneath the workshop floorboards lies a closed-loop geothermal array comprising 32 boreholes sunk 150 meters into the subalpine limestone. This zero-emission system stabilizes internal ambient temperature to within ±0.1°C throughout the year, an indispensable prerequisite for machining titanium components to micron tolerances.',
      'The superstructure itself echoes our horological ethos: Grade 5 brushed titanium columns, sustainably harvested Swiss spruce timbers, and a living sedum moss green roof that naturally insulates the cleanroom complexes against winter blizzards.'
    ],
    specs: [
      { label: 'Manufacture Elevation', value: '1,004 m (Vallée de Joux)' },
      { label: 'Energy Charter', value: '100% On-Site Solar & Geothermal' },
      { label: 'Cleanroom Thermal Precision', value: '±0.1°C Continuous Regulation' },
      { label: 'Structural Framework', value: 'Grade 5 Titanium & Swiss Alpine Spruce' },
      { label: 'Glazing Technology', value: 'Dynamic Electrochromic Triple-Glazed' },
      { label: 'Carbon Status', value: 'Net-Negative Alpine Facility' }
    ]
  },
  'art-3': {
    id: 'art-3',
    title: 'The Mastery of Internal Anglage Chamfering',
    subtitle: 'Why Hand-Polished Gentian Wood Bevels Can Never Be Replicated by CNC Mills',
    category: 'Métiers d’Art Finishing',
    date: 'August 2026',
    read: '5 min read',
    author: 'Yvan Doret',
    authorRole: 'Dean of Métiers d’Art & Master Finisher',
    image: '/assets/images/craftsmanship_watchmaker_1791612587562.jpg',
    pullQuote: 'No five-axis mill can ever carve an internal acute angle; only human patience and local gentian wood achieve true black polish.',
    excerpt: 'Why machine-cut bevels can never replicate the mirror black polish achieved by hand with Jura gentian wood.',
    targetKeywords: [
      'internal anglage chamfering',
      'gentian wood polishing',
      'Haute Horlogerie finishing',
      'hand-finished calibres',
      'black mirror polish'
    ],
    content: [
      'Modern 5-axis CNC machines and spark-erosion wire EDM equipment have unquestionably elevated base machining accuracy across Swiss horology. Yet in haute finishing, machines encounter an insurmountable physical limitation: rotating cutters cannot produce an acute internal corner without leaving a microscopic radial curve.',
      'At Maison Aurelia, every movement bridge, cock, and tourbillon cage undergoes traditional hand-beveling (anglage). Using custom steel files ground to specific 45-degree profiles, our angleurs painstakingly carve uniform, sparkling chamfers along every perimeter edge.',
      'The defining step of this craft is the final polish. We harvest dry stems of wild yellow gentian (Gentiana lutea) directly from the meadows surrounding Le Brassus. Sliced into soft wooden pegwood stems and dressed with graduated diamond pastilles, the gentian wood compresses against the metal without altering the razor-sharp border.',
      'The result is a speculaire black-polish reflection—an optical phenomenon where the chamfer appears either blindingly brilliant or pitch black depending on the angle of incoming light. Achieving this level of excellence on a single skeletonized tourbillon bridge requires between 35 and 45 hours of relentless manual labor.'
    ],
    specs: [
      { label: 'Finishing Technique', value: 'Hand-Executed 45° Anglage' },
      { label: 'Polishing Medium', value: 'Natural Jura Gentian Wood Stems' },
      { label: 'Optical Reflection', value: 'Miroir Noir (Black Specular Polish)' },
      { label: 'Manual Labor per Calibre', value: '35 to 45 Hours' },
      { label: 'Corner Geometry', value: 'Sharp Internal Points (Angles Rentrants)' },
      { label: 'Standard Compliance', value: 'Hallmark of Geneva Article 12' }
    ]
  }
};

export const ARTICLES_LIST: Article[] = Object.values(ARTICLES_DATA);
