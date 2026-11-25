// Uma cor por sistema, igual em todos os animais (vista "todos os sistemas").
export const PAL = {
  dig: 0x6fbf3f,   // digestivo — verde
  circ: 0xe0403a,  // circulatório — vermelho
  nerv: 0x3b6fe6,  // nervoso — azul
  resp: 0xa66be0,  // respiratório — roxo
  exc: 0xf2c12e,   // excretor — amarelo
  rep: 0xf07ab4,   // reprodutor — rosa
  gland: 0x2ec4b6, // glândulas — turquesa
  musc: 0xc0834f,  // músculos — castanho
};
export const hex = (c) => '#' + c.toString(16).padStart(6, '0');
