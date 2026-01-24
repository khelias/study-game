// Deterministliku juhuarvu generaator testitavuse jaoks
export const createRng = (seed = Date.now()) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};

// Võtab massiivist suvalise elemendi
export const getRandom = (arr, rng = Math.random) =>
  arr && arr.length > 0 ? arr[Math.floor(rng() * arr.length)] : null;

// Lühi uid järjekindla RNG-ga
export const uid = (rng = Math.random) => rng().toString(36).substr(2, 9);
