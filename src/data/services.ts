export interface ServiceItem {
  id: string;
  name: string;
  category: 'Repair' | 'Maintenance' | 'Cleaning';
  price: number;
  duration: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  image: string;
}

export const TIME_SLOTS: string[] = [
  '9:00 AM – 11:00 AM',
  '11:00 AM – 1:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
];

export const HERO_IMAGE = '/src/assets/images/hero_home_services_1795420355256.jpg';

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-plumbing',
    name: 'Plumbing',
    category: 'Repair',
    price: 499,
    duration: '60 – 90 mins',
    shortDescription: 'Tap repairs, pipe leak fixes, sink fitting, and bathroom drainage unclogging.',
    fullDescription:
      'Complete residential plumbing inspection and repair by experienced technicians. Ideal for leaking faucets, under-sink pipe replacements, flush tank issues, and blocked drains.',
    includes: [
      'Leak inspection and pressure check',
      'Faucet, tap, or valve replacement',
      'Drain and trap unclogging',
      'Post-repair water flow testing',
    ],
    image: '/src/assets/images/service_plumbing_1795420355297.jpg',
  },
  {
    id: 'srv-electrical',
    name: 'Electrical Repairs',
    category: 'Repair',
    price: 399,
    duration: '45 – 75 mins',
    shortDescription: 'Switchboard fixes, MCB checks, ceiling fan installation, and wiring troubleshooting.',
    fullDescription:
      'Safe and dependable home electrical diagnostics and repairs. Covers faulty sockets, tripping circuit breakers, lighting fixtures, and fan mounting.',
    includes: [
      'MCB and distribution board inspection',
      'Socket, switch, and regulator replacement',
      'Ceiling fan or light fixture installation',
      'Voltage and earthing safety check',
    ],
    image: '/src/assets/images/service_electrical_1795420356115.jpg',
  },
  {
    id: 'srv-cleaning',
    name: 'Home Cleaning',
    category: 'Cleaning',
    price: 799,
    duration: '2 – 3 hours',
    shortDescription: 'Deep kitchen, bathroom, floor mopping, and living space sanitization.',
    fullDescription:
      'Thorough room-by-room cleaning for apartments and independent homes using safe cleaning agents and microfiber equipment.',
    includes: [
      'Kitchen counters, stove top, and sink scrubbing',
      'Bathroom tiles and fittings sanitization',
      'Dusting of furniture, fans, and windows',
      'Floor vacuuming and disinfectant mopping',
    ],
    image: '/src/assets/images/service_cleaning_1795420355251.jpg',
  },
  {
    id: 'srv-ac-repair',
    name: 'AC Repair',
    category: 'Maintenance',
    price: 599,
    duration: '60 – 90 mins',
    shortDescription: 'Split & window AC servicing, filter wash, cooling check, and coil cleaning.',
    fullDescription:
      'Keep your air conditioner running quietly and efficiently with complete indoor/outdoor unit servicing, cooling diagnostics, and drain line clearing.',
    includes: [
      'Indoor filter and evaporator coil cleaning',
      'Outdoor condenser wash and airflow check',
      'Thermostat and cooling temperature test',
      'Drain pipe flushing to prevent water leakage',
    ],
    image: '/src/assets/images/service_ac_repair_1795420355766.jpg',
  },
  {
    id: 'srv-carpentry',
    name: 'Carpentry',
    category: 'Maintenance',
    price: 649,
    duration: '60 – 120 mins',
    shortDescription: 'Door hinge alignment, cupboard lock repair, shelf mounting, and furniture fixes.',
    fullDescription:
      'Precision woodwork maintenance for kitchen cabinets, wooden doors, drawers, curtain rods, and wall-mounted shelves.',
    includes: [
      'Cabinet hinge and drawer channel adjustment',
      'Door lock, latch, and stopper installation',
      'Wall shelf and curtain bracket drilling',
      'Minor wooden joint tightening and repair',
    ],
    image: '/src/assets/images/service_carpentry_1795420355316.jpg',
  },
  {
    id: 'srv-appliance',
    name: 'Appliance Repair',
    category: 'Repair',
    price: 549,
    duration: '60 – 90 mins',
    shortDescription: 'Washing machine, refrigerator, and microwave diagnostics and part repair.',
    fullDescription:
      'Fast doorstep troubleshooting for essential home appliances including front/top-load washing machines, refrigerators, and microwave ovens.',
    includes: [
      'Full fault diagnostics and error code check',
      'Motor, inlet valve, or thermostat testing',
      'Cleaning of filters and drainage hoses',
      'Operational test run before handover',
    ],
    image: '/src/assets/images/service_appliance_1795420356452.jpg',
  },
];
