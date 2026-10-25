import type { Track } from '../types.ts';

export const INITIAL_TRACKS: Track[] = [
  // TAMIL
  {
    id: 'tamil-track-1',
    title: 'Marakkuma Nenjam (Acoustic Reverie)',
    tamilTitle: 'மறக்குமா நெஞ்சம் (இசை நினைவுகள்)',
    artist: 'Rahman & Kaviya Rhapsody',
    tamilArtist: 'ரஹ்மான் & காவியா மெலடி',
    album: 'Kollywood Acoustic Lounge',
    tamilAlbum: 'தமிழ் அக்யூஸ்டிக் லவுஞ்ச்',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    duration: 218,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=chill-abstract-intention-12099.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-playing-the-piano-41981-large.mp4',
    platform: 'gaana',
    platformUrl: 'https://gaana.com/album/tamil-acoustic-melodies',
    genre: 'Tamil Soul Melody',
    language: 'tamil',
    bpm: 86,
    accentColor: '#e11d48',
    upvotes: 142,
    lyrics: [
      {
        time: 5,
        text: "Can this heart ever forget the melodies of yesterday?",
        textTamil: "மறக்குமா நெஞ்சம்... காலங்கள் கடந்தாலும் உன் நினைவை?",
        transliteration: "Marakkumaa nenjam... kaalangal kadandhaalum un ninaivai?",
        meaning: "Will this heart ever forget your memory, no matter how much time passes?"
      },
      {
        time: 14,
        text: "Gentle southern breeze whispers your name across the shore",
        textTamil: "தென்றல் காற்று வீசும் வேளையில் உன் பெயரே காற்றில் கலக்குதே",
        transliteration: "Thendral kaatru veesum velaiyil un peyare kaatril kalakkudhe",
        meaning: "When the southern breeze blows, your name dissolves gently into the wind"
      },
      {
        time: 25,
        text: "Violin strings weep with tender love in twilight stillness",
        textTamil: "மௌன இரவில் வீணை மீட்ட... இதயம் உருகி வழியுதே",
        transliteration: "Mowna iravil veenai meetta... idhayam urugi vazhiyudhe",
        meaning: "In silent night when the strings are plucked, the heart melts into poetry"
      },
      {
        time: 38,
        text: "Every tear turns to a note in this eternal raga",
        textTamil: "கண்ணீர் துளிகள் ராகமாகி... காற்றில் தவழ்ந்து பாடுதே",
        transliteration: "Kanneer thuligal raagamaagi... kaatril thavazhndhu paadudhe",
        meaning: "Each tear transforms into a melody, crawling across the winds in harmony"
      }
    ]
  },
  {
    id: 'tamil-track-2',
    title: 'Chennai Neon Rain (சென்னையின் மழை இரவு)',
    tamilTitle: 'சென்னையின் மழை இரவு (மின்னல் துளிகள்)',
    artist: 'Anirudh Wave Syndicate',
    tamilArtist: 'அனிருத் சின்த் இசை',
    album: 'Marina Cyber Echoes',
    tamilAlbum: 'மெரினா நைட் டிரைவ்',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    duration: 195,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-2099-10701.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-with-neon-signs-and-rain-42841-large.mp4',
    platform: 'ytmusic',
    platformUrl: 'https://music.youtube.com/playlist?list=PLtamil_trending_2026',
    genre: 'Tamil Electro Synth',
    language: 'tamil',
    bpm: 126,
    accentColor: '#ff0000',
    upvotes: 119,
    lyrics: [
      {
        time: 4,
        text: "Neon lights reflecting on Marina shoreline road",
        textTamil: "மெரினா சாலையில் மின்னும் நீல விளக்குகள்...",
        transliteration: "Marina saalaiyil minnum neela vilakkugal...",
        meaning: "Blue neon lights twinkling across the Marina beach highway..."
      },
      {
        time: 12,
        text: "Heavy raindrops beat rhythm on the roof like acoustic drums",
        textTamil: "மழைத் துளிகள் தாளம் போட நெஞ்சில் எழும் புது வேகம்",
        transliteration: "Mazhai thuligal thaalam poda nenjil ezhum pudhu vegam",
        meaning: "Raindrops tapping the rhythm, awakening fresh energy in our soul"
      },
      {
        time: 24,
        text: "Bass vibrating through the dashboard, night is young",
        textTamil: "பாஸ் சத்தம் காற்றில் அதிர... சென்னை நகரமே துடிக்குதே",
        transliteration: "Bass saththam kaatril adhira... Chennai nagarame thudikkudhe",
        meaning: "As the bass vibrates the air, the city of Chennai pulses with life"
      }
    ]
  },

  // HINDI / BOLLYWOOD
  {
    id: 'hindi-track-1',
    title: 'Tum Mile Phir Se (तुम मिले फिर से)',
    nativeTitle: 'तुम मिले फिर से (अकौस्टिक धुन)',
    tamilTitle: 'உன்னை மீண்டும் சந்தித்தேன்',
    artist: 'Arijit & Pritam Vibes',
    nativeArtist: 'अरिजीत सिंह स्टाइल',
    album: 'Bollywood Velvet 2026',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    duration: 210,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=piano-moment-9835.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-along-a-coastal-road-at-sunset-42861-large.mp4',
    platform: 'gaana',
    platformUrl: 'https://gaana.com/song/tum-mile-acoustic',
    genre: 'Hindi Soul Acoustic',
    language: 'hindi',
    bpm: 78,
    accentColor: '#e11d48',
    upvotes: 185,
    lyrics: [
      {
        time: 5,
        text: "When you met me again, life found its lost melody",
        nativeScript: "तुम मिले फिर से तो ज़िंदगी को एक नई धुन मिली...",
        textTamil: "நீ மீண்டும் வந்த போது, வாழ்க்கை ஒரு புதிய ராகம் கண்டது...",
        transliteration: "Tum mile phir se to zindagi ko ek nayi dhun mili...",
        meaning: "When our paths crossed again, life found a whole new song to sing"
      },
      {
        time: 15,
        text: "Silent night winds carry the aroma of your presence",
        nativeScript: "खामोश हवाएं तेरी खुशबू का पैगाम लाती हैं",
        textTamil: "மௌனக் காற்று உன் நினைவின் நறுமணத்தை சுமந்து வருதே",
        transliteration: "Khaamosh hawayein teri khushboo ka paigaam laati hain",
        meaning: "The quiet evening breeze brings the sweet fragrance of your remembrance"
      },
      {
        time: 28,
        text: "Hold my hands beneath the star-lit sky",
        nativeScript: "तारों की छांव में थाम लो हाथ मेरा",
        textTamil: "விண்மீன்கள் கூட்டத்தில் என் கையை இறுகப் பிடி",
        transliteration: "Taaron ki chaanv mein thaam lo haath mera",
        meaning: "Hold my hands tight beneath the glowing canopy of stars"
      }
    ]
  },

  // TELUGU
  {
    id: 'telugu-track-1',
    title: 'Samajavaragamana Waves (సామజవరగమన)',
    nativeTitle: 'సామజవరగమన (స్పేషియల్ లో-ఫై)',
    tamilTitle: 'சாமஜவரகமனா லோ-பை',
    artist: 'Thaman & Sid Sriram Vibe',
    nativeArtist: 'థమన్ & సిద్ శ్రీరామ్ శైలి',
    album: 'Tollywood Gold Re-imagined',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    duration: 198,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_24a2ef69b6.mp3?filename=groove-funk-modern-party-125438.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-playing-the-piano-41981-large.mp4',
    platform: 'ytmusic',
    platformUrl: 'https://music.youtube.com/playlist?list=PLtelugu_hits_2026',
    genre: 'Telugu Groovy Pop',
    language: 'telugu',
    bpm: 104,
    accentColor: '#ff0000',
    upvotes: 133,
    lyrics: [
      {
        time: 6,
        text: "Walking like majestic swan with rhythmic grace",
        nativeScript: "సామజవరగమనా... నీ నడకలో ఎంతటి అందం...",
        textTamil: "அன்னநடை போட்டு வரும் பேரழகே...",
        transliteration: "Saamajavaragamana... nee nadakalo enthatee andam...",
        meaning: "Graceful like a swan, how mesmerizing is your every step..."
      },
      {
        time: 16,
        text: "Your smile blossoms like lotus in morning dawn",
        nativeScript: "నీ చిరునవ్వు ఉదయపు కమలంలా వికసిస్తుంది",
        textTamil: "உன் புன்னகை காலை தாமரை போல் மலருதே",
        transliteration: "Nee chirunavvu udayapu kamalamlaa vikasisthundhi",
        meaning: "Your tender smile blossoms like a pure lotus in early dawn"
      }
    ]
  },

  // MALAYALAM
  {
    id: 'malayalam-track-1',
    title: 'Aaromaley Monsoon (ആരോമലേ)',
    nativeTitle: 'ആരോമലേ (മഴക്കാറ്റ് മെലഡി)',
    tamilTitle: 'ஆரோமலே மழைக்கால ராகம்',
    artist: 'Sushin & Kochi Indie Collective',
    nativeArtist: 'സുഷിൻ ശ്യാം സ്റ്റൈൽ',
    album: 'Gods Own Country Sessions',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    duration: 205,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=spirit-blossom-15285.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-glass-roof-41517-large.mp4',
    platform: 'gaana',
    platformUrl: 'https://gaana.com/album/malayalam-monsoon-chill',
    genre: 'Malayalam Indie Folk',
    language: 'malayalam',
    bpm: 82,
    accentColor: '#10b981',
    upvotes: 112,
    lyrics: [
      {
        time: 5,
        text: "Beloved soul, drifting through misty backwater rains",
        nativeScript: "ആരോമലേ... കായലോളങ്ങളിൽ പെയ്യുന്ന മഴയോടൊപ്പം...",
        textTamil: "என் அன்பே... காயல் அலைகளில் பெய்யும் மழையோடு...",
        transliteration: "Aaromaley... kaayalolangalil peyyunna mazhayodoppam...",
        meaning: "My beloved, drifting along with the monsoon rain over tranquil backwaters"
      },
      {
        time: 16,
        text: "Green coconut palms sway to the gentle riverside song",
        nativeScript: "പച്ചപ്പനയോലകൾ പുഴയോരത്ത് കാറ്റിലാടുന്നു",
        textTamil: "பச்சை பனை மரங்கள் நதிக்கரையில் காற்றில் ஆடுதே",
        transliteration: "Pachappanayolakal puzhayorathu kaattilaadunnu",
        meaning: "Lush green palms sway along the river bank in pure harmony"
      }
    ]
  },

  // PUNJABI
  {
    id: 'punjabi-track-1',
    title: 'Lover Horizon (ਲਵਰ ਨਾਈਟਸ)',
    nativeTitle: 'ਲਵਰ ਨਾਈਟਸ (ਸਿੰਥ ਬੀਟਸ)',
    tamilTitle: 'பஞ்சாபி லவ்வர் சின்த்',
    artist: 'Diljit & AP Dhillon Waves',
    nativeArtist: 'ਦਿਲਜੀਤ ਦੋਸਾਂਝ ਵਾਈਬ',
    album: 'Punjab Cyber Funk 2026',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    duration: 185,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-lights-at-night-42838-large.mp4',
    platform: 'ytmusic',
    platformUrl: 'https://music.youtube.com/playlist?list=PLpunjabi_groove_2026',
    genre: 'Punjabi Synth-Pop',
    language: 'punjabi',
    bpm: 115,
    accentColor: '#ff0000',
    upvotes: 167,
    lyrics: [
      {
        time: 4,
        text: "Driving down highway lights in deep neon glow",
        nativeScript: "ਤੇਰਾ ਹੀ ਖਿਆਲ ਐ ਨੀ ਜਦੋਂ ਦੀ ਰਾਤ ਹੋਈ...",
        textTamil: "இரவு விடியும் வரை உன் நினைவே என்னோடு...",
        transliteration: "Tera hi khyaal hai ni jadon di raat hoyi...",
        meaning: "Only thoughts of you remain ever since the night settled in..."
      },
      {
        time: 14,
        text: "Turn the sub-bass up, we celebrate life tonight",
        nativeScript: "ਬਾਸ ਵਧਾ ਕੇ ਨੱਚੀਏ, ਜ਼ਿੰਦਗੀ ਨੂੰ ਗਲੇ ਲਗਾਈਏ",
        textTamil: "பாஸ் இசையை உயர்த்தி நாம் கொண்டாடுவோம்",
        transliteration: "Bass vadha ke nachiye, zindagi nu gale lagaiye",
        meaning: "Turn the bass up high and dance, embracing every beat of life"
      }
    ]
  },

  // GLOBAL / ENGLISH
  {
    id: 'track-1',
    title: 'Midnight City Lights',
    tamilTitle: 'நடுநிசி நகர விளக்குகள்',
    artist: 'Neon Mirage',
    tamilArtist: 'நியோன் மிராஜ்',
    album: 'Synthetic Dreams 2026',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    duration: 214,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-lights-at-night-42838-large.mp4',
    platform: 'spotify',
    platformUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    genre: 'Synthwave',
    language: 'english',
    bpm: 124,
    accentColor: '#10b981',
    upvotes: 95,
    lyrics: [
      {
        time: 4,
        text: "Skylines glowing in electric cyan...",
        textTamil: "வானில் ஒளிரும் நீல மின் விளக்குகள்...",
        transliteration: "Vaanil olirum neela min vilakkugal...",
        meaning: "Skylines glowing in electric cyan shades..."
      },
      {
        time: 10,
        text: "Reflecting chrome across the glass highway",
        textTamil: "கண்ணாடிச் சாலையில் மின்னும் உலோக வெளிச்சம்",
        transliteration: "Kannaadi saalaiyil minnum uloga velicham",
        meaning: "Reflecting chrome across the modern glass highway"
      }
    ]
  },
  {
    id: 'track-2',
    title: 'Spatial Aurora (Dolby Atmos)',
    tamilTitle: 'விண்வெளி வண்ணங்கள் (ஆப்பிள் ஸ்பேஷியல்)',
    artist: 'Kira & The Resonance',
    tamilArtist: 'கீரா & ரெசோனன்ஸ்',
    album: 'Apple Spatial Sessions',
    releaseYear: 2026,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    duration: 188,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=chill-abstract-intention-12099.mp3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-northern-lights-in-the-night-sky-41481-large.mp4',
    platform: 'apple',
    platformUrl: 'https://music.apple.com/us/album/spatial-aurora/159823412',
    genre: 'Ambient Chill',
    language: 'english',
    bpm: 88,
    accentColor: '#fb7185',
    upvotes: 88,
    lyrics: [
      {
        time: 5,
        text: "Celestial curtains ripple in violet green",
        textTamil: "வானில் ஆடும் ஊதா-பச்சை வண்ண அலைகள்",
        transliteration: "Vaanil aadum oodha-pachai vanna alaigal",
        meaning: "Violet and green aurora waves dancing across the sky"
      }
    ]
  }
];

export const PLAYLIST_CATEGORIES = [
  { id: 'all', name: 'All Releases' },
  { id: 'tamil', name: 'தமிழ் (Tamil)' },
  { id: 'hindi', name: 'हिंदी (Hindi)' },
  { id: 'telugu', name: 'తెలుగు (Telugu)' },
  { id: 'malayalam', name: 'മലയാളം (Malayalam)' },
  { id: 'punjabi', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { id: 'english', name: 'English & Global' },
  { id: 'gaana', name: 'Gaana Exclusives' },
  { id: 'ytmusic', name: 'YouTube Music Hits' },
  { id: 'spotify', name: 'Spotify Top Charts' },
  { id: 'apple', name: 'Apple Music Spatial' }
];
