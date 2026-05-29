export const WAIT_TIME = 3;

export const WORD_CATEGORIES: Record<string, string[]> = {
  haiwan: [
    "KERA", "KUDA", "GAJAH", "SINGA", "LEBAH", "SEMUT", "KATAK", "BUAYA",
    "GAGAK", "LEMBU", "TIKUS", "SIPUT", "BERUK", "ANGSA", "KUCING", "KELDAI",
    "HARIMAU", "BERUANG",
  ],
  makanan: [
    "NASI", "SATE", "ROTI", "SAYUR", "TELUR", "PULUT", "ROJAK",
    "PIZA", "SOSEJ", "NANAS", "BETIK", "LAKSA", "BIHUN",
    "DODOL", "WAJIK", "KICAP", "DAGING", "KACANG", "KEROPOK", "KETUPAT",
  ],
  pekerjaan: [
    "GURU", "DOKTOR", "POLIS", "BOMBA", "HAKIM", "ASKAR",
    "PAKAR", "BADUT", "ATLET", "PEGUAM", "NELAYAN", "TENTERA",
  ],
  buah: [
    "EPAL", "OREN", "MANGGA", "PISANG", "DURIAN",
    "LANGSAT", "MANGGIS", "NANGKA", "CERI", "JAMBU",
  ],
  warna: [
    "MERAH", "BIRU", "HIJAU", "KUNING", "UNGU",
    "HITAM", "PUTIH", "COKLAT", "JINGGA", "KELABU", "EMAS", "PERAK",
  ],
  negeri: [
    "KEDAH", "PERAK", "PERLIS", "PAHANG", "MELAKA", "SABAH", "JOHOR",
  ],
  ikan: [
    "IKAN", "TONGKOL", "KELI", "KEMBUNG", "PARI", "PATIN", "SELAR", "KERAPU",
  ],
  negara: ["MESIR", "YAMAN", "JEPUN", "CHINA", "INDIA", "KOREA", "BRUNEI", "KANADA", "BRAZIL", "ITALI", "SWEDEN", "NORWAY"],
  planet: ["BUMI", "MARIKH", "ZUHRAH", "UTARID", "ZUHAL", "NEPTUN"],
  bunga: ["ROSA", "MAWAR", "ORKID", "TERATAI", "LILI", "JASMEN", "KEMBOJA", "MELATI", "DAISI"],
  kenderaan: ["KERETA", "SKUTER", "TEKSI", "LORI", "KAPAL", "BECA", "TREN"],
  sukan: ["BOLA", "RAGBI", "HOKI", "TENIS", "GOLF", "LUMBA", "SENAM", "PANAH", "SILAT", "TINJU"],
  benda: ["MEJA", "LAMPU", "PINTU", "TIKAR", "BANTAL", "CERMIN", "BALDI", "CAWAN", "SUDU"],
  alam: ["HUJAN", "RIBUT", "PETIR", "AWAN", "SUNGAI", "LAUT", "PANTAI", "HUTAN", "TASIK", "ANGIN"],
  anggota: ["TANGAN", "HIDUNG", "MULUT", "LIDAH", "RAMBUT", "DAGU", "GIGI", "DAHI", "LUTUT", "KAKI"],
  sekolah: ["BUKU", "PENSIL", "CIKGU", "DEWAN", "KELAS", "ASRAMA", "KANTIN", "PAPAN", "UJIAN"],
  teknologi: ["SKRIN", "KABEL", "LAMAN", "ENJIN", "RADIO", "DRON", "KAMERA", "BUTANG", "SERVER", "SISTEM"],
  pakaian: ["BAJU", "SELUAR", "KASUT", "TUDUNG", "KAIN", "TOPI", "JAKET", "SARUNG", "TALI"],
  rumah: ["DAPUR", "BILIK", "TANDAS", "TINGKAP", "LAMPU", "GARAJ", "SOFA", "TILAM", "PAGAR"],
  cuaca: ["PANAS", "HUJAN", "RIBUT", "PETIR", "ANGIN", "KABUS", "CUACA", "BAHANG", "SEJUK", "TEDUH"],
};

export const TARGET_LEVELS = [1000, 2000, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];

const CATEGORY_KEYS = Object.keys(WORD_CATEGORIES);

export function isValidWord(word: string): boolean {
  return word.length >= 4 && word.length <= 7;
}

export function getWordForCategory(category: string): string {
  const words = (WORD_CATEGORIES[category] || WORD_CATEGORIES.haiwan).filter(isValidWord);
  return words[Math.floor(Math.random() * words.length)];
}

export function getRandomCategory(exclude?: string): string {
  const filtered = exclude ? CATEGORY_KEYS.filter((c) => c !== exclude) : CATEGORY_KEYS;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function checkGuess(guess: string, target: string): { letter: string; status: "correct" | "wrong-position" | "wrong" }[] {
  const result: { letter: string; status: "correct" | "wrong-position" | "wrong" }[] = [];
  const targetArr = target.split("");
  const guessArr = guess.split("");
  const used = targetArr.map(() => false);

  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = { letter: guessArr[i], status: "correct" };
      used[i] = true;
    } else {
      result[i] = { letter: guessArr[i], status: "wrong" };
    }
  }

  for (let i = 0; i < guessArr.length; i++) {
    if (result[i].status === "correct") continue;
    for (let j = 0; j < targetArr.length; j++) {
      if (!used[j] && guessArr[i] === targetArr[j]) {
        result[i] = { letter: guessArr[i], status: "wrong-position" };
        used[j] = true;
        break;
      }
    }
  }

  return result;
}
