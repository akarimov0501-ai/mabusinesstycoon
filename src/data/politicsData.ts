import { PoliticalOffice, LobbyingPolicy, GovtContract } from '../types/game';

export const INITIAL_POLITICAL_OFFICES: PoliticalOffice[] = [
  {
    id: 'Mayor',
    title: 'Shahar Hokimi (City Mayor)',
    requiredPrestige: 500,
    campaignCost: 250000, // in personal cash
    requiredApproval: 50,
    salaryPerSec: 25, // $25/s govt salary
    powerDescription: 'Mahalliy tijorat zonalarini nazorat qilish va biznes obyektlari uchun ijara xarajatlarini 10% ga kamaytirish.',
    isOccupied: false,
    perks: ['-10% Ijara Xarajatlari', 'Shahar Savdo Imtiyozi', 'PR Reputatsiya +15%'],
  },
  {
    id: 'Governor',
    title: 'Shtat / Viloyat Gubernatori',
    requiredPrestige: 3500,
    campaignCost: 2500000,
    requiredApproval: 65,
    salaryPerSec: 150,
    powerDescription: 'Mintaqaviy infrastrukturani boshqarish, transport va kommunal soliqlardan ozod bo\'lish.',
    isOccupied: false,
    perks: ['-15% Barcha Biznes Operatsion Xarajatlari', 'Avtonom Infrastruktura', 'Tenderlarda +20% Ustunlik'],
  },
  {
    id: 'Minister',
    title: 'Moliya va Iqtisodiyot Vaziri',
    requiredPrestige: 25000,
    campaignCost: 25000000,
    requiredApproval: 75,
    salaryPerSec: 1200,
    powerDescription: 'Mamlakat bank va soliq siyosatini shakllantirish, korporatsiyalar uchun favqulodda dotatsiyalar ajratish.',
    isOccupied: false,
    perks: ['-5% Korporativ Soliq Stavkasi', '-2% Markaziy Bank Kredit Foizi', 'Eksport Subsidiyalari'],
  },
  {
    id: 'President',
    title: 'Davlat Prezidenti / Bosh Vazir',
    requiredPrestige: 150000,
    campaignCost: 250000000,
    requiredApproval: 85,
    salaryPerSec: 10000,
    powerDescription: 'Oliy davlat rahbarligi. To\'liq qonunchilik va harbiy-sanoat tenderlariga kirish huquqi.',
    isOccupied: false,
    perks: ['Offshor Soliq Imtiyozi (Min 4%)', 'Barcha Davlat Tenderlariga Ruxsat', 'Monopoliya Himoyasi'],
  },
];

export const INITIAL_LOBBYING_POLICIES: LobbyingPolicy[] = [
  {
    id: 'tax_relief_bill',
    name: 'Soliq Islohotlari to\'g\'risidagi Qonun (Tax Relief Act)',
    description: 'Biznesni rivojlantirish uchun korporativ soliq stavkalarini 4% ga tushirishni qonuniylashtirish.',
    cost: 500000, // Corporate Cash
    effectDescription: 'Korporativ Soliq Stavkasi -4% ga kamayadi',
    status: 'available',
    progressSec: 0,
    targetSec: 60,
    taxDiscount: 0.04,
  },
  {
    id: 'eco_exemption_bill',
    name: 'Ekologik Nazorat va Xom-ashyo Imtiyozi (Supply Exemption)',
    description: 'Ishlab chiqarish va zavodlar uchun xom-ashyo (COGS) hamda logistika bojlarini kamaytirish.',
    cost: 2500000,
    effectDescription: 'Biznes Xom-ashyo (COGS) Xarajatlari -10% tejaydi',
    status: 'available',
    progressSec: 0,
    targetSec: 120,
    cogsDiscount: 0.10,
  },
  {
    id: 'bank_rate_discount_bill',
    name: 'Markaziy Bank Kredit Foizi Subsidiyasi',
    description: 'Katta tijorat va ipoteka kreditlari foiz stavkalarini davlat hisobidan tushirish.',
    cost: 10000000,
    effectDescription: 'Kredit Foiz Stavkasi -2.5% ga pasayadi',
    status: 'available',
    progressSec: 0,
    targetSec: 180,
    loanRateDiscount: 0.025,
  },
  {
    id: 'antimonopoly_shield_bill',
    name: 'Strategik Monopoliya daxlsizligi to\'g\'risidagi Qonun',
    description: 'Yirik holdinglarni davlat anti-monopoliya surishtiruvlaridan 100% himoya qilish.',
    cost: 50000000,
    effectDescription: 'Barcha Raqobatchilarni sotib olish va Bozor Ulushini 90%+ gacha oshirish ruxsati',
    status: 'available',
    progressSec: 0,
    targetSec: 300,
    govtContractBoost: 0.50,
  },
];

export const INITIAL_GOVT_CONTRACTS: GovtContract[] = [
  {
    id: 'contract_smart_city',
    title: 'Milliy "Aqlli Shahar" Infratuzilma Loyihasi',
    department: 'Iqtisodiyot va Shaharsozlik Vazirligi',
    revenuePerSec: 2500, // +$2,500/s passive revenue
    requiredNetWorth: 5000000,
    requiredOffice: 'Mayor',
    active: false,
  },
  {
    id: 'contract_superhighway_logistics',
    title: 'Davlat Magistral & Logistika Avtomagistrali',
    department: 'Transport Vazirligi',
    revenuePerSec: 15000,
    requiredNetWorth: 25000000,
    requiredOffice: 'Governor',
    active: false,
  },
  {
    id: 'contract_defense_ai_system',
    title: 'Mudofaa Sanoati AI & Neyron Superkompyuter Klasteri',
    department: 'Mudofaa Vazirligi',
    revenuePerSec: 85000,
    requiredNetWorth: 150000000,
    requiredOffice: 'Minister',
    active: false,
  },
  {
    id: 'contract_space_station',
    title: 'Orbital Kosmik Stansiya va Oy Bazasi Ta\'minoti',
    department: 'Kosmik Aeronavtika Kengashi',
    revenuePerSec: 500000,
    requiredNetWorth: 1000000000,
    requiredOffice: 'President',
    active: false,
  },
];
