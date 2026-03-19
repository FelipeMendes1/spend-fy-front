export const BANCOS_RECONHECIDOS = [
  { 
    nomes: ['nubank', 'nu', 'roxinho'], 
    cor: 'bg-purple-600', 
    texto: 'text-purple-600',
    bgLight: 'bg-purple-50'
  },
  { 
    nomes: ['inter', 'banco inter'], 
    cor: 'bg-orange-500', 
    texto: 'text-orange-500',
    bgLight: 'bg-orange-50'
  },
  { 
    nomes: ['itau', 'itau unibanco'], 
    cor: 'bg-blue-800', 
    texto: 'text-blue-800',
    bgLight: 'bg-blue-50'
  },
  { 
    nomes: ['bradesco'], 
    cor: 'bg-red-600', 
    texto: 'text-red-600',
    bgLight: 'bg-red-50'
  },
  { 
    nomes: ['santander'], 
    cor: 'bg-red-700', 
    texto: 'text-red-700',
    bgLight: 'bg-red-50'
  },
  { 
    nomes: ['caixa', 'cef'], 
    cor: 'bg-blue-600', 
    texto: 'text-blue-600',
    bgLight: 'bg-blue-50'
  },
  { 
    nomes: ['bb', 'banco do brasil'], 
    cor: 'bg-yellow-400', 
    texto: 'text-yellow-600',
    bgLight: 'bg-yellow-50'
  }
];

export const getBankStyle = (nome) => {
  const nomeMinusculo = nome.toLowerCase();
  
  const banco = BANCOS_RECONHECIDOS.find(b => 
    b.nomes.some(n => nomeMinusculo.includes(n))
  );

  return banco || {
    cor: 'bg-gray-600',
    texto: 'text-gray-600',
    bgLight: 'bg-gray-50'
  };
};