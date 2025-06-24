
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EmojiGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  currentEmoji?: string;
}

const emojiCategories = {
  'Objetos': ['📝', '📊', '📈', '📉', '💼', '💰', '💎', '🔥', '⚡', '💡', '🎯', '🚀', '⭐', '✨', '🎉', '🏆', '👑', '💻', '📱', '⚙️', '🔧', '🔨', '📋', '📌', '📍', '🗂️', '📁', '📂', '🗃️', '📑', '📄', '📃', '📜', '📰', '🗞️', '📺', '📻', '☎️', '📞', '📟', '📠', '🔍', '🔎', '💳', '💰', '💸', '💵', '💴', '💶', '💷'],
  'Símbolos': ['✅', '❌', '❓', '❗', '💯', '🔔', '🔕', '🔊', '🔇', '📢', '📣', '💬', '💭', '🗯️', '♠️', '♥️', '♦️', '♣️', '🎵', '🎶', '🎼', '🎤', '🎧', '📻', '🎷', '🎸', '🎹', '🥁', '🎺', '📯', '🎻', '🪕', '🎮', '🕹️', '🎯', '🎲', '🎰', '🎳'],
  'Emoticons': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴'],
  'Gestos': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶'],
  'Natureza': ['🌱', '🌿', '🍀', '🌾', '🌵', '🌲', '🌳', '🌴', '🌸', '🌺', '🌻', '🌹', '🥀', '🌷', '💐', '🌼', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌟', '💫', '⭐', '🌠', '☀️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '⚡', '❄️', '☃️', '⛄'],
  'Transporte': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁', '🛸', '🚀', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚢', '🛥️', '🚤', '⛵', '🛶', '🚉', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚍']
};

// Mapeamento de emojis para palavras-chave em português
const emojiKeywords: { [key: string]: string[] } = {
  '📝': ['papel', 'nota', 'escrever', 'documento', 'texto', 'anotação'],
  '📊': ['gráfico', 'estatística', 'dados', 'relatório', 'análise'],
  '📈': ['crescimento', 'alta', 'subir', 'lucro', 'ganho', 'aumento'],
  '📉': ['queda', 'baixa', 'descer', 'perda', 'diminuição'],
  '💼': ['maleta', 'trabalho', 'negócio', 'empresa', 'escritório'],
  '💰': ['dinheiro', 'moeda', 'rico', 'pagamento', 'saco de dinheiro'],
  '💎': ['diamante', 'joia', 'precioso', 'valioso', 'pedra preciosa'],
  '🔥': ['fogo', 'quente', 'popular', 'trending', 'sucesso'],
  '⚡': ['raio', 'energia', 'elétrico', 'rápido', 'velocidade'],
  '💡': ['ideia', 'lâmpada', 'criatividade', 'inovação', 'solução'],
  '🎯': ['alvo', 'objetivo', 'meta', 'foco', 'precisão'],
  '🚀': ['foguete', 'lançamento', 'crescimento', 'sucesso', 'inovação'],
  '⭐': ['estrela', 'favorito', 'destaque', 'qualidade', 'avaliação'],
  '✨': ['brilho', 'mágico', 'especial', 'destaque', 'novo'],
  '🎉': ['festa', 'celebração', 'parabéns', 'sucesso', 'alegria'],
  '🏆': ['troféu', 'vencedor', 'prêmio', 'primeiro lugar', 'campeão'],
  '👑': ['coroa', 'rei', 'líder', 'premium', 'vip'],
  '💻': ['computador', 'laptop', 'tecnologia', 'trabalho', 'programação'],
  '📱': ['celular', 'telefone', 'smartphone', 'mobile', 'app'],
  '⚙️': ['configuração', 'ajuste', 'ferramenta', 'opção', 'settings'],
  '🔧': ['chave', 'ferramenta', 'reparo', 'conserto', 'manutenção'],
  '🔨': ['martelo', 'construção', 'ferramenta', 'trabalho', 'construir'],
  '📋': ['prancheta', 'lista', 'tarefa', 'checklist', 'formulário'],
  '📌': ['alfinete', 'fixar', 'importante', 'marcar', 'destacar'],
  '📍': ['localização', 'lugar', 'endereço', 'mapa', 'posição'],
  '🗂️': ['arquivo', 'pasta', 'organização', 'documento', 'filing'],
  '📁': ['pasta', 'arquivo', 'documento', 'organizar', 'folder'],
  '📂': ['pasta aberta', 'arquivo', 'documento', 'abrir', 'acessar'],
  '🗃️': ['arquivo', 'gaveta', 'organização', 'documento', 'armazenar'],
  '📑': ['página', 'documento', 'papel', 'formulário', 'lista'],
  '📄': ['documento', 'página', 'papel', 'arquivo', 'texto'],
  '📃': ['página', 'documento', 'papel', 'nota', 'curl'],
  '📜': ['pergaminho', 'documento antigo', 'certificado', 'diploma'],
  '📰': ['jornal', 'notícia', 'informação', 'mídia', 'imprensa'],
  '🗞️': ['jornal', 'notícia', 'informação', 'rolled newspaper'],
  '📺': ['televisão', 'tv', 'mídia', 'entretenimento', 'canal'],
  '📻': ['rádio', 'música', 'som', 'áudio', 'estação'],
  '☎️': ['telefone', 'ligação', 'contato', 'comunicação'],
  '📞': ['telefone', 'ligação', 'contato', 'atender'],
  '📟': ['pager', 'comunicação', 'mensagem', 'antigo'],
  '📠': ['fax', 'documento', 'enviar', 'comunicação'],
  '🔍': ['lupa', 'pesquisar', 'buscar', 'procurar', 'encontrar'],
  '🔎': ['lupa', 'pesquisar', 'buscar', 'procurar', 'investigar'],
  '💳': ['cartão', 'pagamento', 'crédito', 'débito', 'compra'],
  '💸': ['dinheiro voando', 'gasto', 'despesa', 'perda', 'caro'],
  '💵': ['dólar', 'dinheiro', 'nota', 'moeda americana'],
  '💴': ['yen', 'dinheiro', 'moeda japonesa', 'nota'],
  '💶': ['euro', 'dinheiro', 'moeda europeia', 'nota'],
  '💷': ['libra', 'dinheiro', 'moeda inglesa', 'nota'],
  '✅': ['check', 'correto', 'feito', 'aprovado', 'sim', 'ok'],
  '❌': ['x', 'errado', 'não', 'cancelar', 'deletar', 'erro'],
  '❓': ['pergunta', 'dúvida', 'questão', 'help', 'ajuda'],
  '❗': ['exclamação', 'importante', 'atenção', 'aviso', 'urgente'],
  '💯': ['cem', 'perfeito', 'completo', 'máximo', 'top'],
  '🔔': ['sino', 'notificação', 'alerta', 'lembrete', 'aviso'],
  '🔕': ['sino mudo', 'silencioso', 'sem som', 'mute'],
  '🔊': ['alto', 'som', 'volume', 'áudio', 'speaker'],
  '🔇': ['mudo', 'sem som', 'silêncio', 'mute'],
  '📢': ['megafone', 'anúncio', 'comunicação', 'alto-falante'],
  '📣': ['megafone', 'anúncio', 'grito', 'comunicação'],
  '💬': ['conversa', 'chat', 'mensagem', 'falar', 'diálogo'],
  '💭': ['pensamento', 'ideia', 'pensar', 'reflexão'],
  '🗯️': ['raiva', 'bravo', 'irritado', 'explosão'],
  '♠️': ['espadas', 'cartas', 'jogo', 'poker'],
  '♥️': ['coração', 'amor', 'cartas', 'like', 'curtir'],
  '♦️': ['diamante', 'cartas', 'jogo', 'poker'],
  '♣️': ['paus', 'cartas', 'jogo', 'poker'],
  '🎵': ['música', 'nota musical', 'som', 'melodia'],
  '🎶': ['música', 'notas musicais', 'som', 'melodia'],
  '🎼': ['partitura', 'música', 'compositor', 'notas'],
  '🎤': ['microfone', 'cantar', 'música', 'show', 'apresentação'],
  '🎧': ['fone', 'música', 'escutar', 'áudio', 'headphone'],
  '🎷': ['saxofone', 'música', 'jazz', 'instrumento'],
  '🎸': ['guitarra', 'música', 'rock', 'instrumento'],
  '🎹': ['piano', 'música', 'teclado', 'instrumento'],
  '🥁': ['bateria', 'música', 'ritmo', 'instrumento'],
  '🎺': ['trompete', 'música', 'instrumento', 'sopro'],
  '📯': ['corneta', 'música', 'instrumento', 'postal horn'],
  '🎻': ['violino', 'música', 'clássica', 'instrumento'],
  '🪕': ['banjo', 'música', 'country', 'instrumento'],
  '🎮': ['videogame', 'jogo', 'controle', 'gaming'],
  '🕹️': ['joystick', 'videogame', 'controle', 'arcade'],
  '🎲': ['dado', 'jogo', 'sorte', 'azar', 'random'],
  '🎰': ['caça-níquel', 'sorte', 'casino', 'jogo'],
  '🎳': ['boliche', 'jogo', 'esporte', 'bowling'],
  '😀': ['feliz', 'sorriso', 'alegre', 'contente', 'happy'],
  '😃': ['feliz', 'sorriso', 'alegre', 'animado', 'excited'],
  '😄': ['feliz', 'sorriso', 'alegre', 'radiante', 'joy'],
  '😁': ['sorriso', 'alegre', 'feliz', 'grin'],
  '😆': ['rindo', 'feliz', 'diversão', 'laughing'],
  '😅': ['suor', 'rindo', 'nervoso', 'aliviado'],
  '🤣': ['rindo muito', 'engraçado', 'hilário', 'rofl'],
  '😂': ['chorando de rir', 'muito engraçado', 'tears of joy'],
  '🙂': ['sorriso', 'feliz', 'contente', 'slight smile'],
  '🙃': ['de cabeça para baixo', 'brincalhão', 'upside down'],
  '😉': ['piscada', 'brincalhão', 'malicioso', 'wink'],
  '😊': ['feliz', 'alegre', 'blushing', 'envergonhado'],
  '😇': ['anjo', 'inocente', 'santo', 'halo'],
  '🥰': ['apaixonado', 'amor', 'coração', 'smiling with hearts'],
  '😍': ['apaixonado', 'amor', 'heart eyes', 'coração'],
  '🤩': ['impressionado', 'star struck', 'famoso', 'wow'],
  '😘': ['beijo', 'amor', 'kiss', 'carinho'],
  '😗': ['beijo', 'amor', 'kiss', 'whistling'],
  '😚': ['beijo', 'amor', 'kiss', 'closed eyes'],
  '😙': ['beijo', 'amor', 'kiss', 'smiling'],
  '😋': ['delicioso', 'gostoso', 'yummy', 'savoring'],
  '😛': ['língua', 'brincalhão', 'playful', 'tongue'],
  '😜': ['língua', 'brincalhão', 'piscada', 'winking tongue'],
  '🤪': ['louco', 'maluco', 'zany', 'crazy'],
  '😝': ['língua', 'brincalhão', 'squinting tongue'],
  '🤑': ['dinheiro', 'rico', 'money mouth', 'ganancioso'],
  '🤗': ['abraço', 'carinho', 'hugging', 'acolhedor'],
  '🤭': ['ups', 'segredo', 'hand over mouth', 'oops'],
  '🤫': ['silêncio', 'segredo', 'shh', 'quieto'],
  '🤔': ['pensando', 'dúvida', 'thinking', 'reflexão'],
  '🤐': ['boca fechada', 'segredo', 'zipper mouth', 'calado'],
  '🤨': ['desconfiado', 'raised eyebrow', 'suspicious'],
  '😐': ['neutro', 'sem expressão', 'neutral face'],
  '😑': ['sem expressão', 'expressionless', 'sério'],
  '😶': ['sem boca', 'no mouth', 'sem palavras'],
  '😏': ['malicioso', 'smirking', 'maroto'],
  '😒': ['entediado', 'unamused', 'chateado'],
  '🙄': ['revirando os olhos', 'eye roll', 'obviamente'],
  '😬': ['constrangido', 'grimacing', 'awkward'],
  '🤥': ['mentindo', 'lying', 'pinocchio'],
  '😌': ['aliviado', 'relieved', 'peaceful'],
  '😔': ['triste', 'pensive', 'pensativo'],
  '😪': ['cansado', 'sleepy', 'sono'],
  '🤤': ['babando', 'drooling', 'delicioso'],
  '😴': ['dormindo', 'sleeping', 'sono'],
  '👍': ['joinha', 'legal', 'thumbs up', 'aprovado', 'like'],
  '👎': ['não curti', 'thumbs down', 'reprovado', 'dislike'],
  '👌': ['ok', 'perfeito', 'ok hand', 'beleza'],
  '🤌': ['italian hand', 'que isso', 'pinched fingers'],
  '🤏': ['pequeno', 'pinching hand', 'pouquinho'],
  '✌️': ['paz', 'peace', 'vitória', 'victory'],
  '🤞': ['dedos cruzados', 'crossed fingers', 'sorte'],
  '🤟': ['love you', 'rock and roll', 'te amo'],
  '🤘': ['rock', 'rock and roll', 'metal'],
  '🤙': ['call me', 'hang loose', 'shaka'],
  '👈': ['apontando esquerda', 'pointing left'],
  '👉': ['apontando direita', 'pointing right'],
  '👆': ['apontando cima', 'pointing up'],
  '🖕': ['dedo do meio', 'middle finger', 'ofensa'],
  '👇': ['apontando baixo', 'pointing down'],
  '☝️': ['índice cima', 'index pointing up'],
  '👋': ['tchau', 'oi', 'waving hand', 'acenando'],
  '🤚': ['mão levantada', 'raised back of hand'],
  '🖐️': ['mão aberta', 'hand with fingers splayed'],
  '✋': ['pare', 'stop', 'raised hand'],
  '🖖': ['spock', 'vulcan salute', 'star trek'],
  '👏': ['palmas', 'clapping hands', 'parabéns'],
  '🙌': ['aleluia', 'raising hands', 'celebração'],
  '👐': ['mãos abertas', 'open hands', 'abraço'],
  '🤲': ['palms up', 'pedindo', 'recebendo'],
  '🤝': ['aperto de mão', 'handshake', 'acordo'],
  '🙏': ['rezar', 'por favor', 'prayer', 'obrigado'],
  '✍️': ['escrevendo', 'writing hand', 'assinatura'],
  '💅': ['unhas', 'nail polish', 'manicure'],
  '🤳': ['selfie', 'selfie hand', 'foto'],
  '💪': ['forte', 'flexed biceps', 'músculo'],
  '🦾': ['braço mecânico', 'mechanical arm', 'robô'],
  '🦵': ['perna', 'leg', 'chute'],
  '🦿': ['perna mecânica', 'mechanical leg', 'prótese'],
  '🦶': ['pé', 'foot', 'caminhar'],
  '🌱': ['broto', 'seedling', 'crescimento', 'planta'],
  '🌿': ['erva', 'herb', 'folha', 'natureza'],
  '🍀': ['trevo', 'four leaf clover', 'sorte'],
  '🌾': ['grão', 'ear of rice', 'agricultura'],
  '🌵': ['cacto', 'cactus', 'deserto'],
  '🌲': ['pinheiro', 'evergreen tree', 'árvore'],
  '🌳': ['árvore', 'deciduous tree', 'natureza'],
  '🌴': ['palmeira', 'palm tree', 'praia', 'tropical'],
  '🌸': ['flor', 'cherry blossom', 'primavera'],
  '🌺': ['hibisco', 'hibiscus', 'flor tropical'],
  '🌻': ['girassol', 'sunflower', 'amarelo'],
  '🌹': ['rosa', 'rose', 'amor', 'romantic'],
  '🥀': ['rosa murcha', 'wilted flower', 'tristeza'],
  '🌷': ['tulipa', 'tulip', 'flor'],
  '💐': ['buquê', 'bouquet', 'flores'],
  '🌼': ['margarida', 'blossom', 'flor'],
  '🌙': ['lua', 'crescent moon', 'noite'],
  '🌛': ['lua com rosto', 'first quarter moon face'],
  '🌜': ['lua com rosto', 'last quarter moon face'],
  '🌚': ['lua nova', 'new moon face', 'escuro'],
  '🌕': ['lua cheia', 'full moon', 'bright'],
  '🌖': ['lua minguante', 'waning gibbous moon'],
  '🌗': ['lua', 'last quarter moon'],
  '🌘': ['lua crescente', 'waning crescent moon'],
  '🌑': ['lua nova', 'new moon', 'escuro'],
  '🌒': ['lua crescente', 'waxing crescent moon'],
  '🌓': ['primeiro quarto', 'first quarter moon'],
  '🌔': ['lua crescente', 'waxing gibbous moon'],
  '🌟': ['estrela brilhante', 'glowing star', 'destaque'],
  '💫': ['estrela cadente', 'dizzy star', 'tonto'],
  '🌠': ['meteoro', 'shooting star', 'desejo'],
  '☀️': ['sol', 'sun', 'ensolarado', 'calor'],
  '⛅': ['nuvem', 'partly cloudy', 'sol e nuvem'],
  '⛈️': ['tempestade', 'thunder cloud', 'chuva'],
  '🌤️': ['sol atrás nuvem', 'sun behind small cloud'],
  '🌦️': ['sol chuva', 'sun behind rain cloud'],
  '🌧️': ['chuva', 'cloud with rain', 'chuvoso'],
  '❄️': ['neve', 'snowflake', 'frio', 'inverno'],
  '☃️': ['boneco de neve', 'snowman', 'inverno'],
  '⛄': ['boneco de neve', 'snowman without snow'],
  '🚗': ['carro', 'car', 'automóvel', 'veículo'],
  '🚕': ['táxi', 'taxi', 'cab'],
  '🚙': ['suv', 'sport utility vehicle', 'jipe'],
  '🚌': ['ônibus', 'bus', 'transporte público'],
  '🚎': ['trolleybus', 'ônibus elétrico'],
  '🏎️': ['carro de corrida', 'racing car', 'fórmula 1'],
  '🚓': ['carro de polícia', 'police car', 'viatura'],
  '🚑': ['ambulância', 'ambulance', 'emergência'],
  '🚒': ['caminhão bombeiros', 'fire engine', 'bombeiros'],
  '🚐': ['van', 'minibus', 'transporte'],
  '🛻': ['pickup', 'pickup truck', 'caminhonete'],
  '🚚': ['caminhão', 'delivery truck', 'entrega'],
  '🚛': ['caminhão grande', 'articulated lorry', 'carreta'],
  '🚜': ['trator', 'tractor', 'agricultura'],
  '🏍️': ['moto', 'motorcycle', 'motocicleta'],
  '🛵': ['scooter', 'motor scooter', 'mobilete'],
  '🚲': ['bicicleta', 'bicycle', 'bike'],
  '🛴': ['patinete', 'kick scooter', 'scooter'],
  '🛹': ['skate', 'skateboard', 'radical'],
  '🚁': ['helicóptero', 'helicopter', 'voo'],
  '🛸': ['ovni', 'flying saucer', 'alien'],
  '✈️': ['avião', 'airplane', 'voo', 'viagem'],
  '🛩️': ['avião pequeno', 'small airplane'],
  '🛫': ['decolagem', 'airplane departure', 'partida'],
  '🛬': ['pouso', 'airplane arrival', 'chegada'],
  '🪂': ['paraquedas', 'parachute', 'salto'],
  '💺': ['assento', 'seat', 'poltrona'],
  '🚢': ['navio', 'ship', 'embarcação'],
  '🛥️': ['lancha', 'motor boat', 'barco'],
  '🚤': ['speedboat', 'lancha rápida'],
  '⛵': ['veleiro', 'sailboat', 'vela'],
  '🛶': ['canoa', 'canoe', 'caiaque'],
  '🚉': ['estação', 'station', 'trem'],
  '🚞': ['trem montanha', 'mountain railway'],
  '🚝': ['monotrilho', 'monorail'],
  '🚄': ['trem bala', 'high speed train', 'bullet train'],
  '🚅': ['trem bala', 'bullet train'],
  '🚈': ['metrô', 'light rail', 'trem leve'],
  '🚂': ['locomotiva', 'locomotive', 'trem vapor'],
  '🚆': ['trem', 'train', 'ferrovia'],
  '🚇': ['metrô', 'metro', 'subway'],
  '🚊': ['bonde', 'tram', 'streetcar'],
  '🚍': ['ônibus', 'oncoming bus', 'transporte']
};

export const EmojiGallery = ({ isOpen, onClose, onEmojiSelect, currentEmoji }: EmojiGalleryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Objetos');

  // Função para buscar emojis por palavra-chave em português
  const searchEmojis = (term: string) => {
    if (!term.trim()) return [];
    
    const searchLower = term.toLowerCase().trim();
    const foundEmojis: string[] = [];
    
    // Buscar em todas as categorias
    Object.values(emojiCategories).flat().forEach(emoji => {
      const keywords = emojiKeywords[emoji] || [];
      
      // Verificar se alguma palavra-chave contém o termo de busca
      if (keywords.some(keyword => keyword.toLowerCase().includes(searchLower))) {
        if (!foundEmojis.includes(emoji)) {
          foundEmojis.push(emoji);
        }
      }
    });
    
    return foundEmojis;
  };

  // Determinar quais emojis mostrar
  const getEmojisToShow = () => {
    if (searchTerm.trim()) {
      return searchEmojis(searchTerm);
    } else {
      return emojiCategories[selectedCategory as keyof typeof emojiCategories] || [];
    }
  };

  const filteredEmojis = getEmojisToShow();

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(category);
    // Limpar pesquisa ao trocar de categoria
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Prevenir fechamento automático ao abrir
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent 
        className="max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={handleContentClick}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader onClick={handleContentClick}>
          <DialogTitle>Escolher Emoji</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col" onClick={handleContentClick}>
          {/* Busca */}
          <div className="relative" onClick={handleSearchClick}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar emoji... (ex: dinheiro, coração, casa)"
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
              className="pl-10"
            />
          </div>

          {/* Categorias - só mostrar se não estiver pesquisando */}
          {!searchTerm.trim() && (
            <div className="flex gap-1 overflow-x-auto pb-2" onClick={handleContentClick}>
              {Object.keys(emojiCategories).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => handleCategoryClick(category, e)}
                  className="whitespace-nowrap text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Título da seção */}
          <div className="text-sm font-medium text-gray-600" onClick={handleContentClick}>
            {searchTerm.trim() ? `Resultados para "${searchTerm}"` : selectedCategory}
            <span className="ml-2 text-gray-400">({filteredEmojis.length})</span>
          </div>

          {/* Grade de Emojis */}
          <div className="grid grid-cols-8 gap-2 overflow-y-auto flex-1 pr-2" onClick={handleContentClick}>
            {filteredEmojis.length > 0 ? (
              filteredEmojis.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEmojiClick(emoji);
                  }}
                  className={`w-10 h-10 text-2xl hover:bg-gray-100 rounded flex items-center justify-center transition-colors ${
                    currentEmoji === emoji ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                  }`}
                  title={emojiKeywords[emoji]?.join(', ') || emoji}
                >
                  {emoji}
                </button>
              ))
            ) : (
              <div className="col-span-8 text-center py-8 text-gray-500">
                {searchTerm.trim() ? 'Nenhum emoji encontrado' : 'Nenhum emoji disponível'}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t" onClick={handleContentClick}>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
