/**
 * Utilitário para gerar caminhos de imagens dos produtos
 * Baseado no nome do produto, formata o nome para usar como nome de arquivo
 */

// Mapeamento direto para garantir que os caminhos funcionem
const imageMapping = {
  "Marlboro Red": "/images/cigarros/Marlboro Vermelho.png",
  "Marlboro Gold": "/images/cigarros/Marlboro gold.png",
  "Dunhill Azul": "/images/cigarros/dunhill azul.png",
  "Dunhill Carlton": "/images/cigarros/dunhill carlton.png",
  "Dunhill Double Refresh": "/images/cigarros/dunhill double refresh.png",
  "Dunhill Mix Refresh": "/images/cigarros/dunhill mix refresh.png",
  "Gudang Garam": "/images/cigarros/gudang garam.png",
  "Kent Derby Azul": "/images/cigarros/kent derby azul.png",
  "Kent Derby Silver": "/images/cigarros/kent derby silver.png",
  "Lucky Strike Azul": "/images/cigarros/lucky azul.png",
  "Lucky Strike Double": "/images/cigarros/lucky double.png",
  "Lucky Strike Red": "/images/cigarros/lucky red.png",
  "Marlboro Blue Ice": "/images/cigarros/marlboro blue ice.png",
  "Marlboro Melancia": "/images/cigarros/marlboro melancia.png",
  "Rothmans Prata": "/images/cigarros/rothmans minister  prata.png",
  "Rothmans Purple Boost": "/images/cigarros/rothmans minister  purple boost.png",
  "Rothmans Azul": "/images/cigarros/rothmans minister azul.png",
  "Rothmans Global Azul": "/images/cigarros/rothmans minister global azul.png",
  "Rothmans Global Red": "/images/cigarros/rothmans minister global red.png",
  "Souza Paiol": "/images/cigarros/souza paiol.png",
  "Coca-Cola Lata": "/images/bebidas/coca lata comum.png",
  "Coca-Cola Zero Lata": "/images/bebidas/coca lata zero.png",
  "H2OH 500ml": "/images/bebidas/H2OH! limoneto.png",
  "Coca-Cola 1.5L": "/images/bebidas/coca_comum_1.5l.png",
  "Coca-Cola Zero 1.5L": "/images/bebidas/coca zero 1,5l.png",
  "Dell Vale Uva 200ml": "/images/bebidas/dell vale uva.png",
  "Gatorade Sabores": "/images/bebidas/gatorade sabores.png",
  "Guaravita": "/images/bebidas/guaravita.png",
  "Mate Leão 290ml": "/images/bebidas/mate leão.png",
  "Tabaco Acrema 25g": "/images/tabacaria/tabaco acrema.png",
  "Tabaco Amsterdam": "/images/tabacaria/tabaco amsterdam.png",
  "Tabaco HI Tobacco 25g": "/images/tabacaria/tabaco hi tobacco.png",
  "Tabaco Veio Pimenta 25g": "/images/tabacaria/tabaco veio pimenta 25g.png",
  "Tabaco Veio Pimenta 50g": "/images/tabacaria/tabaco veio pimenta 50g.png",
  "Filtro HI Tobacco Slim": "/images/tabacaria/filtro hi tobacco slim.png",
  "Filtro Papelito Longo": "/images/tabacaria/filtro papelito longo.png",
  "Celulose Aleda": "/images/seda e piteira/celulose aleda.png",
  "Piteira Bem Bolado Pop Large": "/images/seda e piteira/piteira bem bolado pop large.png",
  "Piteira Bem Bolado Pop 1/4": "/images/seda e piteira/piteira bem bolado pop.png",
  "Piteira Bem Bolado Slim": "/images/seda e piteira/piteira bem bolado slim.png",
  "Piteira The OG Small": "/images/seda e piteira/piteira the og small.png",
  "Piteira The OG XL": "/images/seda e piteira/piteira THE OG XL.png",
  "Seda Bem Bolado Brown": "/images/seda e piteira/seda bem bolado brown.png",
  "Seda Bem Bolado Pop Mini": "/images/seda e piteira/seda bem bolado pop mini.png",
  "Seda Bem Bolado Pop Slim": "/images/seda e piteira/seda bem bolado pop slim.png",
  "Seda Bros 66 Blue": "/images/seda e piteira/seda bros 66 blue.png",
  "Seda Bros Premium Pink": "/images/seda e piteira/seda bros premim pink.png",
  "Seda Bros Premium Black": "/images/seda e piteira/seda bros premium black.png",
  "Seda Bros Silver": "/images/seda e piteira/seda bros silver.png",
  "Seda Bros 66 Brown": "/images/seda e piteira/seda bross 66 brown.png",
  "Seda GTI 35": "/images/seda e piteira/seda GTI 35.png",
  "Seda GTI 50": "/images/seda e piteira/seda GTI 50.png",
  "Seda Smolking Brown": "/images/seda e piteira/seda smolking brown.png",
  "Seda Smolking Master": "/images/seda e piteira/seda smolking master.png",
  "Seda Zomo Alfafa": "/images/seda e piteira/seda zomo alfafa.png",
  "Seda Zomo Classic Monster": "/images/seda e piteira/seda zomo classic monster.png",
  "Seda Zomo Mini Black": "/images/seda e piteira/seda zomo mini black.png",
  "Seda Zomo Natural Slim": "/images/seda e piteira/seda zomo natural slim.png",
  "Seda Zomo Perfect Black": "/images/seda e piteira/seda zomo natural monster.png",
  "Seda Zomo Perfect Hemp": "/images/seda e piteira/seda zomo natural perfect.png",
  "Seda Zomo Slim": "/images/seda e piteira/seda zomo slim.png",
  "Pokémon Amigos de Jornada": "/images/generic-product.svg",
  "Pokémon Megaevolução": "/images/generic-product.svg",
  "Pokémon Rivais Predestinados": "/images/generic-product.svg",
  "Cabo iPhone": "/images/generic-product.svg",
  "Cabo USB-C": "/images/generic-product.svg",
  "Cabo Dados USB-C": "/images/generic-product.svg",
  "Carregador USB-C": "/images/generic-product.svg",
  "Fone iPhone": "/images/generic-product.svg"
};

export const getProductImagePath = (productName) => {
  // Se não houver nome do produto, retorna imagem padrão
  if (!productName) {
    return '/images/generic-product.svg';
  }

  // Retorna o caminho direto do mapeamento
  const directPath = imageMapping[productName];
  if (directPath) {
    return directPath;
  }

  // Se não encontrar no mapeamento, usa o formato automático
  const formattedName = productName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .toLowerCase();

  return `/images/${formattedName}.png`;
};

/**
 * Verifica se uma imagem existe (para fallback)
 * Esta função pode ser usada para tratamento de erros
 */
export const handleImageError = (event) => {
  // Se a imagem não carregar, usa uma imagem padrão
  event.target.src = '/images/generic-product.svg';
  event.target.onerror = null; // Evita loop infinito
};
