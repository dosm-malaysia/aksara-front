import type { OptionType } from "@components/types";

export const STATES = [
  {
    label: "Malaysia",
    value: "malaysia",
  },
  {
    label: "Johor",
    value: "johor",
  },
  {
    label: "Kedah",
    value: "kedah",
  },
  {
    label: "Kelantan",
    value: "kelantan",
  },
  {
    label: "Melaka",
    value: "melaka",
  },
  {
    label: "Negeri Sembilan",
    value: "negeri_sembilan",
  },
  {
    label: "Pahang",
    value: "pahang",
  },
  {
    label: "Pulau Pinang",
    value: "pulau_pinang",
  },
  {
    label: "Perak",
    value: "perak",
  },
  {
    label: "Perlis",
    value: "perlis",
  },
  {
    label: "Selangor",
    value: "selangor",
  },
  {
    label: "Terengganu",
    value: "terengganu",
  },
  {
    label: "Sabah",
    value: "sabah",
  },
  {
    label: "Sarawak",
    value: "sarawak",
  },
  {
    label: "W.P. Kuala Lumpur",
    value: "w.p._kuala_lumpur",
  },
  {
    label: "W.P. Labuan",
    value: "w.p._labuan",
  },
  {
    label: "W.P. Putrajaya",
    value: "w.p._putrajaya",
  },
];

export const STATE_MAP: Record<string, string> = (() => {
  return STATES.reduce((prev, current) => {
    return { ...prev, ...{ [current.value]: current.label } };
  }, {});
})();

export const DISTRICTS: Record<string, Array<OptionType>> = {
  "johor": [
    {
      label: "Batu Pahat",
      value: "batu_pahat",
    },
    {
      label: "Johor Bahru",
      value: "johor_bahru",
    },
    {
      label: "Kluang",
      value: "kluang",
    },
    {
      label: "Kota Tinggi",
      value: "kota_tinggi",
    },
    {
      label: "Mersing",
      value: "mersing",
    },
    {
      label: "Muar",
      value: "muar",
    },
    {
      label: "Pontian",
      value: "pontian",
    },
    {
      label: "Segamat",
      value: "segamat",
    },
    {
      label: "Kulai",
      value: "kulai",
    },
    {
      label: "Tangkak",
      value: "tangkak",
    },
  ],
  "kedah": [
    {
      label: "Baling",
      value: "baling",
    },
    {
      label: "Bandar Baharu",
      value: "bandar_baharu",
    },
    {
      label: "Kota Setar",
      value: "kota_setar",
    },
    {
      label: "Kuala Muda",
      value: "kuala_muda",
    },
    {
      label: "Kubang Pasu",
      value: "kubang_pasu",
    },
    {
      label: "Kulim",
      value: "kulim",
    },
    {
      label: "Langkawi",
      value: "langkawi",
    },
    {
      label: "Padang Terap",
      value: "padang_terap",
    },
    {
      label: "Sik",
      value: "sik",
    },
    {
      label: "Yan",
      value: "yan",
    },
    {
      label: "Pendang",
      value: "pendang",
    },
    {
      label: "Pokok Sena",
      value: "pokok_sena",
    },
  ],
  "kelantan": [
    {
      label: "Bachok",
      value: "bachok",
    },
    {
      label: "Kota Bharu",
      value: "kota_bharu",
    },
    {
      label: "Machang",
      value: "machang",
    },
    {
      label: "Pasir Mas",
      value: "pasir_mas",
    },
    {
      label: "Pasir Puteh",
      value: "pasir_puteh",
    },
    {
      label: "Tanah Merah",
      value: "tanah_merah",
    },
    {
      label: "Tumpat",
      value: "tumpat",
    },
    {
      label: "Gua Musang",
      value: "gua_musang",
    },
    {
      label: "Kuala Krai",
      value: "kuala_krai",
    },
    {
      label: "Jeli",
      value: "jeli",
    },
    {
      label: "Kecil Lojing",
      value: "kecil_lojing",
    },
  ],
  "melaka": [
    {
      label: "Alor Gajah",
      value: "alor_gajah",
    },
    {
      label: "Jasin",
      value: "jasin",
    },
    {
      label: "Melaka Tengah",
      value: "melaka_tengah",
    },
  ],
  "negeri_sembilan": [
    {
      label: "Jelebu",
      value: "jelebu",
    },
    {
      label: "Kuala Pilah",
      value: "kuala_pilah",
    },
    {
      label: "Port Dickson",
      value: "port_dickson",
    },
    {
      label: "Rembau",
      value: "rembau",
    },
    {
      label: "Seremban",
      value: "seremban",
    },
    {
      label: "Tampin",
      value: "tampin",
    },
    {
      label: "Jempol",
      value: "jempol",
    },
  ],
  "pahang": [
    {
      label: "Bentong",
      value: "bentong",
    },
    {
      label: "Cameron Highlands",
      value: "cameron_highlands",
    },
    {
      label: "Jerantut",
      value: "jerantut",
    },
    {
      label: "Kuantan",
      value: "kuantan",
    },
    {
      label: "Lipis",
      value: "lipis",
    },
    {
      label: "Pekan",
      value: "pekan",
    },
    {
      label: "Raub",
      value: "raub",
    },
    {
      label: "Temerloh",
      value: "temerloh",
    },
    {
      label: "Rompin",
      value: "rompin",
    },
    {
      label: "Maran",
      value: "maran",
    },
    {
      label: "Bera",
      value: "bera",
    },
  ],
  "pulau_pinang": [
    {
      label: "Seberang Perai Tengah",
      value: "seberang_perai_tengah",
    },
    {
      label: "Seberang Perai Utara",
      value: "seberang_perai_utara",
    },
    {
      label: "Seberang Perai Selatan",
      value: "seberang_perai_selatan",
    },
    {
      label: "Timur Laut",
      value: "timur_laut",
    },
    {
      label: "Barat Daya",
      value: "barat_daya",
    },
  ],
  "perak": [
    {
      label: "Batang Padang",
      value: "batang_padang",
    },
    {
      label: "Manjung",
      value: "manjung",
    },
    {
      label: "Kinta",
      value: "kinta",
    },
    {
      label: "Kerian",
      value: "kerian",
    },
    {
      label: "Kuala Kangsar",
      value: "kuala_kangsar",
    },
    {
      label: "Larut Dan Matang",
      value: "larut_dan_matang",
    },
    {
      label: "Hilir Perak",
      value: "hilir_perak",
    },
    {
      label: "Hulu Perak",
      value: "hulu_perak",
    },
    {
      label: "Perak Tengah",
      value: "perak_tengah",
    },
    {
      label: "Kampar",
      value: "kampar",
    },
    {
      label: "Muallim",
      value: "muallim",
    },
    {
      label: "Bagan Datuk",
      value: "bagan_datuk",
    },
    {
      label: "Selama",
      value: "selama",
    },
  ],
  "perlis": [
    {
      label: "Perlis",
      value: "perlis",
    },
  ],
  "selangor": [
    {
      label: "Gombak",
      value: "gombak",
    },
    {
      label: "Klang",
      value: "klang",
    },
    {
      label: "Kuala Langat",
      value: "kuala_langat",
    },
    {
      label: "Kuala Selangor",
      value: "kuala_selangor",
    },
    {
      label: "Petaling",
      value: "petaling",
    },
    {
      label: "Sabak Bernam",
      value: "sabak_bernam",
    },
    {
      label: "Sepang",
      value: "sepang",
    },
    {
      label: "Ulu Langat",
      value: "ulu_langat",
    },
    {
      label: "Ulu Selangor",
      value: "ulu_selangor",
    },
  ],
  "terengganu": [
    {
      label: "Besut",
      value: "besut",
    },
    {
      label: "Dungun",
      value: "dungun",
    },
    {
      label: "Kemaman",
      value: "kemaman",
    },
    {
      label: "Kuala Terengganu",
      value: "kuala_terengganu",
    },
    {
      label: "Marang",
      value: "marang",
    },
    {
      label: "Hulu Terengganu",
      value: "hulu_terengganu",
    },
    {
      label: "Setiu",
      value: "setiu",
    },
    {
      label: "Kuala Nerus",
      value: "kuala_nerus",
    },
  ],
  "sabah": [
    {
      label: "Tawau",
      value: "tawau",
    },
    {
      label: "Lahad Datu",
      value: "lahad_datu",
    },
    {
      label: "Semporna",
      value: "semporna",
    },
    {
      label: "Sandakan",
      value: "sandakan",
    },
    {
      label: "Kinabatangan",
      value: "kinabatangan",
    },
    {
      label: "Beluran",
      value: "beluran",
    },
    {
      label: "Kota Kinabalu",
      value: "kota_kinabalu",
    },
    {
      label: "Ranau",
      value: "ranau",
    },
    {
      label: "Kota Belud",
      value: "kota_belud",
    },
    {
      label: "Tuaran",
      value: "tuaran",
    },
    {
      label: "Penampang",
      value: "penampang",
    },
    {
      label: "Papar",
      value: "papar",
    },
    {
      label: "Kudat",
      value: "kudat",
    },
    {
      label: "Kota Marudu",
      value: "kota_marudu",
    },
    {
      label: "Pitas",
      value: "pitas",
    },
    {
      label: "Beaufort",
      value: "beaufort",
    },
    {
      label: "Kuala Penyu",
      value: "kuala_penyu",
    },
    {
      label: "Sipitang",
      value: "sipitang",
    },
    {
      label: "Tenom",
      value: "tenom",
    },
    {
      label: "Nabawan",
      value: "nabawan",
    },
    {
      label: "Keningau",
      value: "keningau",
    },
    {
      label: "Tambunan",
      value: "tambunan",
    },
    {
      label: "Kunak",
      value: "kunak",
    },
    {
      label: "Tongod",
      value: "tongod",
    },
    {
      label: "Putatan",
      value: "putatan",
    },
    {
      label: "Telupid",
      value: "telupid",
    },
    {
      label: "Kalabakan",
      value: "kalabakan",
    },
  ],
  "sarawak": [
    {
      label: "Kuching",
      value: "kuching",
    },
    {
      label: "Bau",
      value: "bau",
    },
    {
      label: "Lundu",
      value: "lundu",
    },
    {
      label: "Samarahan",
      value: "samarahan",
    },
    {
      label: "Serian",
      value: "serian",
    },
    {
      label: "Simunjan",
      value: "simunjan",
    },
    {
      label: "Sri Aman",
      value: "sri_aman",
    },
    {
      label: "Lubok Antu",
      value: "lubok_antu",
    },
    {
      label: "Betong",
      value: "betong",
    },
    {
      label: "Saratok",
      value: "saratok",
    },
    {
      label: "Sarikei",
      value: "sarikei",
    },
    {
      label: "Maradong",
      value: "maradong",
    },
    {
      label: "Daro",
      value: "daro",
    },
    {
      label: "Julau",
      value: "julau",
    },
    {
      label: "Sibu",
      value: "sibu",
    },
    {
      label: "Dalat",
      value: "dalat",
    },
    {
      label: "Mukah",
      value: "mukah",
    },
    {
      label: "Kanowit",
      value: "kanowit",
    },
    {
      label: "Bintulu",
      value: "bintulu",
    },
    {
      label: "Tatau",
      value: "tatau",
    },
    {
      label: "Kapit",
      value: "kapit",
    },
    {
      label: "Song",
      value: "song",
    },
    {
      label: "Belaga",
      value: "belaga",
    },
    {
      label: "Miri",
      value: "miri",
    },
    {
      label: "Marudi",
      value: "marudi",
    },
    {
      label: "Limbang",
      value: "limbang",
    },
    {
      label: "Lawas",
      value: "lawas",
    },
    {
      label: "Matu",
      value: "matu",
    },
    {
      label: "Asajaya",
      value: "asajaya",
    },
    {
      label: "Pakan",
      value: "pakan",
    },
    {
      label: "Selangau",
      value: "selangau",
    },
    {
      label: "Tebedu",
      value: "tebedu",
    },
    {
      label: "Pusa",
      value: "pusa",
    },
    {
      label: "Kabong",
      value: "kabong",
    },
    {
      label: "Tanjung Manis",
      value: "tanjung_manis",
    },
    {
      label: "Sebauh",
      value: "sebauh",
    },
    {
      label: "Bukit Mabong",
      value: "bukit_mabong",
    },
    {
      label: "Subis",
      value: "subis",
    },
    {
      label: "Beluru",
      value: "beluru",
    },
    {
      label: "Telang Usan",
      value: "telang_usan",
    },
  ],
  "w.p._kuala_lumpur": [
    {
      label: "W.P. Kuala Lumpur",
      value: "w.p._kuala_lumpur",
    },
  ],
  "w.p._labuan": [
    {
      label: "W.P. Labuan",
      value: "w.p._labuan",
    },
  ],
  "w.p._putrajaya": [
    {
      label: "W.P. Putrajaya",
      value: "w.p._putrajaya",
    },
  ],
};

export const PARLIMENS: Record<string, Array<OptionType>> = {
  "johor": [
    {
      label: "Batu Pahat",
      value: "batu_pahat",
    },
    {
      label: "Johor Bahru",
      value: "johor_bahru",
    },
    {
      label: "Kluang",
      value: "kluang",
    },
    {
      label: "Kota Tinggi",
      value: "kota_tinggi",
    },
    {
      label: "Mersing",
      value: "mersing",
    },
    {
      label: "Muar",
      value: "muar",
    },
    {
      label: "Pontian",
      value: "pontian",
    },
    {
      label: "Segamat",
      value: "segamat",
    },
    {
      label: "Kulai",
      value: "kulai",
    },
    {
      label: "Tangkak",
      value: "tangkak",
    },
  ],
  "kedah": [
    {
      label: "Baling",
      value: "baling",
    },
    {
      label: "Bandar Baharu",
      value: "bandar_baharu",
    },
    {
      label: "Kota Setar",
      value: "kota_setar",
    },
    {
      label: "Kuala Muda",
      value: "kuala_muda",
    },
    {
      label: "Kubang Pasu",
      value: "kubang_pasu",
    },
    {
      label: "Kulim",
      value: "kulim",
    },
    {
      label: "Langkawi",
      value: "langkawi",
    },
    {
      label: "Padang Terap",
      value: "padang_terap",
    },
    {
      label: "Sik",
      value: "sik",
    },
    {
      label: "Yan",
      value: "yan",
    },
    {
      label: "Pendang",
      value: "pendang",
    },
    {
      label: "Pokok Sena",
      value: "pokok_sena",
    },
  ],
  "kelantan": [
    {
      label: "Bachok",
      value: "bachok",
    },
    {
      label: "Kota Bharu",
      value: "kota_bharu",
    },
    {
      label: "Machang",
      value: "machang",
    },
    {
      label: "Pasir Mas",
      value: "pasir_mas",
    },
    {
      label: "Pasir Puteh",
      value: "pasir_puteh",
    },
    {
      label: "Tanah Merah",
      value: "tanah_merah",
    },
    {
      label: "Tumpat",
      value: "tumpat",
    },
    {
      label: "Gua Musang",
      value: "gua_musang",
    },
    {
      label: "Kuala Krai",
      value: "kuala_krai",
    },
    {
      label: "Jeli",
      value: "jeli",
    },
    {
      label: "Kecil Lojing",
      value: "kecil_lojing",
    },
  ],
  "melaka": [
    {
      label: "Alor Gajah",
      value: "alor_gajah",
    },
    {
      label: "Jasin",
      value: "jasin",
    },
    {
      label: "Melaka Tengah",
      value: "melaka_tengah",
    },
  ],
  "negeri_sembilan": [
    {
      label: "Jelebu",
      value: "jelebu",
    },
    {
      label: "Kuala Pilah",
      value: "kuala_pilah",
    },
    {
      label: "Port Dickson",
      value: "port_dickson",
    },
    {
      label: "Rembau",
      value: "rembau",
    },
    {
      label: "Seremban",
      value: "seremban",
    },
    {
      label: "Tampin",
      value: "tampin",
    },
    {
      label: "Jempol",
      value: "jempol",
    },
  ],
  "pahang": [
    {
      label: "Bentong",
      value: "bentong",
    },
    {
      label: "Cameron Highlands",
      value: "cameron_highlands",
    },
    {
      label: "Jerantut",
      value: "jerantut",
    },
    {
      label: "Kuantan",
      value: "kuantan",
    },
    {
      label: "Lipis",
      value: "lipis",
    },
    {
      label: "Pekan",
      value: "pekan",
    },
    {
      label: "Raub",
      value: "raub",
    },
    {
      label: "Temerloh",
      value: "temerloh",
    },
    {
      label: "Rompin",
      value: "rompin",
    },
    {
      label: "Maran",
      value: "maran",
    },
    {
      label: "Bera",
      value: "bera",
    },
  ],
  "pulau_pinang": [
    {
      label: "Seberang Perai Tengah",
      value: "seberang_perai_tengah",
    },
    {
      label: "Seberang Perai Utara",
      value: "seberang_perai_utara",
    },
    {
      label: "Seberang Perai Selatan",
      value: "seberang_perai_selatan",
    },
    {
      label: "Timur Laut",
      value: "timur_laut",
    },
    {
      label: "Barat Daya",
      value: "barat_daya",
    },
  ],
  "perak": [
    {
      label: "Batang Padang",
      value: "batang_padang",
    },
    {
      label: "Manjung",
      value: "manjung",
    },
    {
      label: "Kinta",
      value: "kinta",
    },
    {
      label: "Kerian",
      value: "kerian",
    },
    {
      label: "Kuala Kangsar",
      value: "kuala_kangsar",
    },
    {
      label: "Larut Dan Matang",
      value: "larut_dan_matang",
    },
    {
      label: "Hilir Perak",
      value: "hilir_perak",
    },
    {
      label: "Hulu Perak",
      value: "hulu_perak",
    },
    {
      label: "Perak Tengah",
      value: "perak_tengah",
    },
    {
      label: "Kampar",
      value: "kampar",
    },
    {
      label: "Muallim",
      value: "muallim",
    },
    {
      label: "Bagan Datuk",
      value: "bagan_datuk",
    },
    {
      label: "Selama",
      value: "selama",
    },
  ],
  "perlis": [
    {
      label: "Perlis",
      value: "perlis",
    },
  ],
  "selangor": [
    {
      label: "Gombak",
      value: "gombak",
    },
    {
      label: "Klang",
      value: "klang",
    },
    {
      label: "Kuala Langat",
      value: "kuala_langat",
    },
    {
      label: "Kuala Selangor",
      value: "kuala_selangor",
    },
    {
      label: "Petaling",
      value: "petaling",
    },
    {
      label: "Sabak Bernam",
      value: "sabak_bernam",
    },
    {
      label: "Sepang",
      value: "sepang",
    },
    {
      label: "Ulu Langat",
      value: "ulu_langat",
    },
    {
      label: "Ulu Selangor",
      value: "ulu_selangor",
    },
  ],
  "terengganu": [
    {
      label: "Besut",
      value: "besut",
    },
    {
      label: "Dungun",
      value: "dungun",
    },
    {
      label: "Kemaman",
      value: "kemaman",
    },
    {
      label: "Kuala Terengganu",
      value: "kuala_terengganu",
    },
    {
      label: "Marang",
      value: "marang",
    },
    {
      label: "Hulu Terengganu",
      value: "hulu_terengganu",
    },
    {
      label: "Setiu",
      value: "setiu",
    },
    {
      label: "Kuala Nerus",
      value: "kuala_nerus",
    },
  ],
  "sabah": [
    {
      label: "Tawau",
      value: "tawau",
    },
    {
      label: "Lahad Datu",
      value: "lahad_datu",
    },
    {
      label: "Semporna",
      value: "semporna",
    },
    {
      label: "Sandakan",
      value: "sandakan",
    },
    {
      label: "Kinabatangan",
      value: "kinabatangan",
    },
    {
      label: "Beluran",
      value: "beluran",
    },
    {
      label: "Kota Kinabalu",
      value: "kota_kinabalu",
    },
    {
      label: "Ranau",
      value: "ranau",
    },
    {
      label: "Kota Belud",
      value: "kota_belud",
    },
    {
      label: "Tuaran",
      value: "tuaran",
    },
    {
      label: "Penampang",
      value: "penampang",
    },
    {
      label: "Papar",
      value: "papar",
    },
    {
      label: "Kudat",
      value: "kudat",
    },
    {
      label: "Kota Marudu",
      value: "kota_marudu",
    },
    {
      label: "Pitas",
      value: "pitas",
    },
    {
      label: "Beaufort",
      value: "beaufort",
    },
    {
      label: "Kuala Penyu",
      value: "kuala_penyu",
    },
    {
      label: "Sipitang",
      value: "sipitang",
    },
    {
      label: "Tenom",
      value: "tenom",
    },
    {
      label: "Nabawan",
      value: "nabawan",
    },
    {
      label: "Keningau",
      value: "keningau",
    },
    {
      label: "Tambunan",
      value: "tambunan",
    },
    {
      label: "Kunak",
      value: "kunak",
    },
    {
      label: "Tongod",
      value: "tongod",
    },
    {
      label: "Putatan",
      value: "putatan",
    },
    {
      label: "Telupid",
      value: "telupid",
    },
    {
      label: "Kalabakan",
      value: "kalabakan",
    },
  ],
  "sarawak": [
    {
      label: "Kuching",
      value: "kuching",
    },
    {
      label: "Bau",
      value: "bau",
    },
    {
      label: "Lundu",
      value: "lundu",
    },
    {
      label: "Samarahan",
      value: "samarahan",
    },
    {
      label: "Serian",
      value: "serian",
    },
    {
      label: "Simunjan",
      value: "simunjan",
    },
    {
      label: "Sri Aman",
      value: "sri_aman",
    },
    {
      label: "Lubok Antu",
      value: "lubok_antu",
    },
    {
      label: "Betong",
      value: "betong",
    },
    {
      label: "Saratok",
      value: "saratok",
    },
    {
      label: "Sarikei",
      value: "sarikei",
    },
    {
      label: "Maradong",
      value: "maradong",
    },
    {
      label: "Daro",
      value: "daro",
    },
    {
      label: "Julau",
      value: "julau",
    },
    {
      label: "Sibu",
      value: "sibu",
    },
    {
      label: "Dalat",
      value: "dalat",
    },
    {
      label: "Mukah",
      value: "mukah",
    },
    {
      label: "Kanowit",
      value: "kanowit",
    },
    {
      label: "Bintulu",
      value: "bintulu",
    },
    {
      label: "Tatau",
      value: "tatau",
    },
    {
      label: "Kapit",
      value: "kapit",
    },
    {
      label: "Song",
      value: "song",
    },
    {
      label: "Belaga",
      value: "belaga",
    },
    {
      label: "Miri",
      value: "miri",
    },
    {
      label: "Marudi",
      value: "marudi",
    },
    {
      label: "Limbang",
      value: "limbang",
    },
    {
      label: "Lawas",
      value: "lawas",
    },
    {
      label: "Matu",
      value: "matu",
    },
    {
      label: "Asajaya",
      value: "asajaya",
    },
    {
      label: "Pakan",
      value: "pakan",
    },
    {
      label: "Selangau",
      value: "selangau",
    },
    {
      label: "Tebedu",
      value: "tebedu",
    },
    {
      label: "Pusa",
      value: "pusa",
    },
    {
      label: "Kabong",
      value: "kabong",
    },
    {
      label: "Tanjung Manis",
      value: "tanjung_manis",
    },
    {
      label: "Sebauh",
      value: "sebauh",
    },
    {
      label: "Bukit Mabong",
      value: "bukit_mabong",
    },
    {
      label: "Subis",
      value: "subis",
    },
    {
      label: "Beluru",
      value: "beluru",
    },
    {
      label: "Telang Usan",
      value: "telang_usan",
    },
  ],
  "w.p._kuala_lumpur": [
    {
      label: "W.P. Kuala Lumpur",
      value: "w.p._kuala_lumpur",
    },
  ],
  "w.p._labuan": [
    {
      label: "W.P. Labuan",
      value: "w.p._labuan",
    },
  ],
  "w.p._putrajaya": [
    {
      label: "W.P. Putrajaya",
      value: "w.p._putrajaya",
    },
  ],
};

export const DUNS: Record<string, Array<OptionType>> = {
  "johor": [
    {
      label: "Batu Pahat",
      value: "batu_pahat",
    },
    {
      label: "Johor Bahru",
      value: "johor_bahru",
    },
    {
      label: "Kluang",
      value: "kluang",
    },
    {
      label: "Kota Tinggi",
      value: "kota_tinggi",
    },
    {
      label: "Mersing",
      value: "mersing",
    },
    {
      label: "Muar",
      value: "muar",
    },
    {
      label: "Pontian",
      value: "pontian",
    },
    {
      label: "Segamat",
      value: "segamat",
    },
    {
      label: "Kulai",
      value: "kulai",
    },
    {
      label: "Tangkak",
      value: "tangkak",
    },
  ],
  "kedah": [
    {
      label: "Baling",
      value: "baling",
    },
    {
      label: "Bandar Baharu",
      value: "bandar_baharu",
    },
    {
      label: "Kota Setar",
      value: "kota_setar",
    },
    {
      label: "Kuala Muda",
      value: "kuala_muda",
    },
    {
      label: "Kubang Pasu",
      value: "kubang_pasu",
    },
    {
      label: "Kulim",
      value: "kulim",
    },
    {
      label: "Langkawi",
      value: "langkawi",
    },
    {
      label: "Padang Terap",
      value: "padang_terap",
    },
    {
      label: "Sik",
      value: "sik",
    },
    {
      label: "Yan",
      value: "yan",
    },
    {
      label: "Pendang",
      value: "pendang",
    },
    {
      label: "Pokok Sena",
      value: "pokok_sena",
    },
  ],
  "kelantan": [
    {
      label: "Bachok",
      value: "bachok",
    },
    {
      label: "Kota Bharu",
      value: "kota_bharu",
    },
    {
      label: "Machang",
      value: "machang",
    },
    {
      label: "Pasir Mas",
      value: "pasir_mas",
    },
    {
      label: "Pasir Puteh",
      value: "pasir_puteh",
    },
    {
      label: "Tanah Merah",
      value: "tanah_merah",
    },
    {
      label: "Tumpat",
      value: "tumpat",
    },
    {
      label: "Gua Musang",
      value: "gua_musang",
    },
    {
      label: "Kuala Krai",
      value: "kuala_krai",
    },
    {
      label: "Jeli",
      value: "jeli",
    },
    {
      label: "Kecil Lojing",
      value: "kecil_lojing",
    },
  ],
  "melaka": [
    {
      label: "Alor Gajah",
      value: "alor_gajah",
    },
    {
      label: "Jasin",
      value: "jasin",
    },
    {
      label: "Melaka Tengah",
      value: "melaka_tengah",
    },
  ],
  "negeri_sembilan": [
    {
      label: "Jelebu",
      value: "jelebu",
    },
    {
      label: "Kuala Pilah",
      value: "kuala_pilah",
    },
    {
      label: "Port Dickson",
      value: "port_dickson",
    },
    {
      label: "Rembau",
      value: "rembau",
    },
    {
      label: "Seremban",
      value: "seremban",
    },
    {
      label: "Tampin",
      value: "tampin",
    },
    {
      label: "Jempol",
      value: "jempol",
    },
  ],
  "pahang": [
    {
      label: "Bentong",
      value: "bentong",
    },
    {
      label: "Cameron Highlands",
      value: "cameron_highlands",
    },
    {
      label: "Jerantut",
      value: "jerantut",
    },
    {
      label: "Kuantan",
      value: "kuantan",
    },
    {
      label: "Lipis",
      value: "lipis",
    },
    {
      label: "Pekan",
      value: "pekan",
    },
    {
      label: "Raub",
      value: "raub",
    },
    {
      label: "Temerloh",
      value: "temerloh",
    },
    {
      label: "Rompin",
      value: "rompin",
    },
    {
      label: "Maran",
      value: "maran",
    },
    {
      label: "Bera",
      value: "bera",
    },
  ],
  "pulau_pinang": [
    {
      label: "Seberang Perai Tengah",
      value: "seberang_perai_tengah",
    },
    {
      label: "Seberang Perai Utara",
      value: "seberang_perai_utara",
    },
    {
      label: "Seberang Perai Selatan",
      value: "seberang_perai_selatan",
    },
    {
      label: "Timur Laut",
      value: "timur_laut",
    },
    {
      label: "Barat Daya",
      value: "barat_daya",
    },
  ],
  "perak": [
    {
      label: "Batang Padang",
      value: "batang_padang",
    },
    {
      label: "Manjung",
      value: "manjung",
    },
    {
      label: "Kinta",
      value: "kinta",
    },
    {
      label: "Kerian",
      value: "kerian",
    },
    {
      label: "Kuala Kangsar",
      value: "kuala_kangsar",
    },
    {
      label: "Larut Dan Matang",
      value: "larut_dan_matang",
    },
    {
      label: "Hilir Perak",
      value: "hilir_perak",
    },
    {
      label: "Hulu Perak",
      value: "hulu_perak",
    },
    {
      label: "Perak Tengah",
      value: "perak_tengah",
    },
    {
      label: "Kampar",
      value: "kampar",
    },
    {
      label: "Muallim",
      value: "muallim",
    },
    {
      label: "Bagan Datuk",
      value: "bagan_datuk",
    },
    {
      label: "Selama",
      value: "selama",
    },
  ],
  "perlis": [
    {
      label: "Perlis",
      value: "perlis",
    },
  ],
  "selangor": [
    {
      label: "Gombak",
      value: "gombak",
    },
    {
      label: "Klang",
      value: "klang",
    },
    {
      label: "Kuala Langat",
      value: "kuala_langat",
    },
    {
      label: "Kuala Selangor",
      value: "kuala_selangor",
    },
    {
      label: "Petaling",
      value: "petaling",
    },
    {
      label: "Sabak Bernam",
      value: "sabak_bernam",
    },
    {
      label: "Sepang",
      value: "sepang",
    },
    {
      label: "Ulu Langat",
      value: "ulu_langat",
    },
    {
      label: "Ulu Selangor",
      value: "ulu_selangor",
    },
  ],
  "terengganu": [
    {
      label: "Besut",
      value: "besut",
    },
    {
      label: "Dungun",
      value: "dungun",
    },
    {
      label: "Kemaman",
      value: "kemaman",
    },
    {
      label: "Kuala Terengganu",
      value: "kuala_terengganu",
    },
    {
      label: "Marang",
      value: "marang",
    },
    {
      label: "Hulu Terengganu",
      value: "hulu_terengganu",
    },
    {
      label: "Setiu",
      value: "setiu",
    },
    {
      label: "Kuala Nerus",
      value: "kuala_nerus",
    },
  ],
  "sabah": [
    {
      label: "Tawau",
      value: "tawau",
    },
    {
      label: "Lahad Datu",
      value: "lahad_datu",
    },
    {
      label: "Semporna",
      value: "semporna",
    },
    {
      label: "Sandakan",
      value: "sandakan",
    },
    {
      label: "Kinabatangan",
      value: "kinabatangan",
    },
    {
      label: "Beluran",
      value: "beluran",
    },
    {
      label: "Kota Kinabalu",
      value: "kota_kinabalu",
    },
    {
      label: "Ranau",
      value: "ranau",
    },
    {
      label: "Kota Belud",
      value: "kota_belud",
    },
    {
      label: "Tuaran",
      value: "tuaran",
    },
    {
      label: "Penampang",
      value: "penampang",
    },
    {
      label: "Papar",
      value: "papar",
    },
    {
      label: "Kudat",
      value: "kudat",
    },
    {
      label: "Kota Marudu",
      value: "kota_marudu",
    },
    {
      label: "Pitas",
      value: "pitas",
    },
    {
      label: "Beaufort",
      value: "beaufort",
    },
    {
      label: "Kuala Penyu",
      value: "kuala_penyu",
    },
    {
      label: "Sipitang",
      value: "sipitang",
    },
    {
      label: "Tenom",
      value: "tenom",
    },
    {
      label: "Nabawan",
      value: "nabawan",
    },
    {
      label: "Keningau",
      value: "keningau",
    },
    {
      label: "Tambunan",
      value: "tambunan",
    },
    {
      label: "Kunak",
      value: "kunak",
    },
    {
      label: "Tongod",
      value: "tongod",
    },
    {
      label: "Putatan",
      value: "putatan",
    },
    {
      label: "Telupid",
      value: "telupid",
    },
    {
      label: "Kalabakan",
      value: "kalabakan",
    },
  ],
  "sarawak": [
    {
      label: "Kuching",
      value: "kuching",
    },
    {
      label: "Bau",
      value: "bau",
    },
    {
      label: "Lundu",
      value: "lundu",
    },
    {
      label: "Samarahan",
      value: "samarahan",
    },
    {
      label: "Serian",
      value: "serian",
    },
    {
      label: "Simunjan",
      value: "simunjan",
    },
    {
      label: "Sri Aman",
      value: "sri_aman",
    },
    {
      label: "Lubok Antu",
      value: "lubok_antu",
    },
    {
      label: "Betong",
      value: "betong",
    },
    {
      label: "Saratok",
      value: "saratok",
    },
    {
      label: "Sarikei",
      value: "sarikei",
    },
    {
      label: "Maradong",
      value: "maradong",
    },
    {
      label: "Daro",
      value: "daro",
    },
    {
      label: "Julau",
      value: "julau",
    },
    {
      label: "Sibu",
      value: "sibu",
    },
    {
      label: "Dalat",
      value: "dalat",
    },
    {
      label: "Mukah",
      value: "mukah",
    },
    {
      label: "Kanowit",
      value: "kanowit",
    },
    {
      label: "Bintulu",
      value: "bintulu",
    },
    {
      label: "Tatau",
      value: "tatau",
    },
    {
      label: "Kapit",
      value: "kapit",
    },
    {
      label: "Song",
      value: "song",
    },
    {
      label: "Belaga",
      value: "belaga",
    },
    {
      label: "Miri",
      value: "miri",
    },
    {
      label: "Marudi",
      value: "marudi",
    },
    {
      label: "Limbang",
      value: "limbang",
    },
    {
      label: "Lawas",
      value: "lawas",
    },
    {
      label: "Matu",
      value: "matu",
    },
    {
      label: "Asajaya",
      value: "asajaya",
    },
    {
      label: "Pakan",
      value: "pakan",
    },
    {
      label: "Selangau",
      value: "selangau",
    },
    {
      label: "Tebedu",
      value: "tebedu",
    },
    {
      label: "Pusa",
      value: "pusa",
    },
    {
      label: "Kabong",
      value: "kabong",
    },
    {
      label: "Tanjung Manis",
      value: "tanjung_manis",
    },
    {
      label: "Sebauh",
      value: "sebauh",
    },
    {
      label: "Bukit Mabong",
      value: "bukit_mabong",
    },
    {
      label: "Subis",
      value: "subis",
    },
    {
      label: "Beluru",
      value: "beluru",
    },
    {
      label: "Telang Usan",
      value: "telang_usan",
    },
  ],
  "w.p._kuala_lumpur": [
    {
      label: "W.P. Kuala Lumpur",
      value: "w.p._kuala_lumpur",
    },
  ],
  "w.p._labuan": [
    {
      label: "W.P. Labuan",
      value: "w.p._labuan",
    },
  ],
  "w.p._putrajaya": [
    {
      label: "W.P. Putrajaya",
      value: "w.p._putrajaya",
    },
  ],
};
