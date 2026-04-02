import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, Droplet, Activity, Menu, ChevronRight, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const normalAudioRef = useRef<HTMLAudioElement>(null);
  const revealedAudioRef1 = useRef<HTMLAudioElement>(null);
  const revealedAudioRef2 = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (!isRevealed) {
      if (normalAudioRef.current) {
        if (isAudioPlaying) {
          normalAudioRef.current.pause();
        } else {
          normalAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
        setIsAudioPlaying(!isAudioPlaying);
      }
    } else {
      if (isAudioPlaying) {
        revealedAudioRef1.current?.pause();
        revealedAudioRef2.current?.pause();
      } else {
        revealedAudioRef1.current?.play().catch(e => console.log(e));
        revealedAudioRef2.current?.play().catch(e => console.log(e));
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '백연') {
      if (normalAudioRef.current) {
        normalAudioRef.current.pause(); // Stop normal BGM when revealing
      }
      triggerReveal();
    } else {
      // In a real site, this would navigate to a search results page.
      // For this demo, we just clear it or show an alert if it's not the trigger word.
      setSearchQuery('');
    }
  };

  const triggerReveal = () => {
    setGlitching(true);
    
    // Play revealed audios
    if (revealedAudioRef1.current) {
      revealedAudioRef1.current.play().catch(e => console.log(e));
    }
    if (revealedAudioRef2.current) {
      revealedAudioRef2.current.play().catch(e => console.log(e));
    }
    setIsAudioPlaying(true);

    setTimeout(() => {
      setIsRevealed(true);
      setGlitching(false);
    }, 1500);
  };

  return (
    <div className={`min-h-screen font-serif transition-colors duration-1000 ${isRevealed ? 'bg-[#050000] text-red-600' : 'bg-white text-zinc-900'}`}>
      {/* 구글 드라이브 직접 다운로드 링크로 변환하여 적용 */}
      <audio ref={normalAudioRef} loop src="https://drive.google.com/uc?export=download&id=1qZd8jTtEGV7T8hq94PtiJs27VfaGfgpH" />
      <audio ref={revealedAudioRef1} loop src="https://drive.google.com/uc?export=download&id=1eRoHm_3KZkGV7yAMFxxPq-T3G94LeXWe" />
      <audio ref={revealedAudioRef2} loop src="https://drive.google.com/uc?export=download&id=1IM_Xfpj_8pqY9YvYrL3lKWu5WQmtloxY" />

      {isRevealed && (
        <div className="fixed inset-0 pointer-events-none z-50 crt-overlay opacity-40 mix-blend-overlay"></div>
      )}

      <AnimatePresence>
        {glitching && <MotherGlitch />}
      </AnimatePresence>

      {!isRevealed ? (
        <NormalMode 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
          isAudioPlaying={isAudioPlaying}
          toggleAudio={toggleAudio}
        />
      ) : (
        <RevealedMode 
          isAudioPlaying={isAudioPlaying}
          toggleAudio={toggleAudio}
        />
      )}
    </div>
  );
}

function MotherGlitch() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 1, 0.8, 1, 0.2, 1, 0, 1],
        filter: ['invert(0)', 'invert(1)', 'invert(0)', 'invert(1)', 'invert(0)']
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, times: [0, 0.1, 0.3, 0.4, 0.6, 0.8, 0.9, 1] }}
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Background scattered text */}
      <div className="absolute inset-0 flex flex-wrap content-start justify-center opacity-60">
        {Array.from({ length: 150 }).map((_, i) => (
          <span 
            key={i} 
            className="text-red-700 font-black text-3xl md:text-6xl m-[-5px] leading-none whitespace-nowrap"
            style={{ 
              transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 2 + 0.5})`,
              opacity: Math.random()
            }}
          >
            나의 어머니
          </span>
        ))}
      </div>
      {/* Foreground giant text */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1.05, 1.2, 1], x: [0, -10, 10, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative z-10 mix-blend-difference text-center flex flex-col"
      >
        <h1 className="text-[15vw] text-white font-black tracking-tighter glitch-text leading-none" data-text="나의 어머니">나의 어머니</h1>
        <h1 className="text-[15vw] text-white font-black tracking-tighter glitch-text leading-none" data-text="나의 어머니">나의 어머니</h1>
        <h1 className="text-[15vw] text-white font-black tracking-tighter glitch-text leading-none" data-text="나의 어머니">나의 어머니</h1>
      </motion.div>
    </motion.div>
  );
}

function NormalMode({ searchQuery, setSearchQuery, handleSearch, isAudioPlaying, toggleAudio }: any) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="https://i.postimg.cc/90Xjn2gB/cheonlongyo-makeu.png" alt="천론교 로고" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold tracking-widest text-zinc-800">천론교</span>
          </div>
          
          <nav className="hidden md:flex gap-10 text-zinc-700 font-medium tracking-wide">
            <a href="#" className="hover:text-red-800 transition-colors">교회소개</a>
            <a href="#" className="hover:text-red-800 transition-colors">예배안내</a>
            <a href="#" className="hover:text-red-800 transition-colors">천관소식</a>
            <a href="#" className="hover:text-red-800 transition-colors">온라인헌금</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={toggleAudio} className="text-zinc-500 hover:text-red-800 transition-colors mr-2" title="배경음악 재생/정지">
              {isAudioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
            <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="통합검색"
                className="border border-zinc-300 rounded-full py-2 pl-5 pr-10 text-sm focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 w-56 transition-all"
              />
              <button type="submit" className="absolute right-3 text-zinc-400 hover:text-red-800">
                <Search size={18} />
              </button>
            </form>
            <button className="md:hidden text-zinc-600">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search (Visible only on small screens) */}
      <div className="md:hidden bg-white p-4 border-b border-zinc-200">
        <form onSubmit={handleSearch} className="relative flex items-center w-full">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="통합검색"
            className="border border-zinc-300 rounded-full py-2 pl-5 pr-10 text-sm focus:outline-none focus:border-red-800 w-full"
          />
          <button type="submit" className="absolute right-3 text-zinc-400 hover:text-red-800">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-24 px-4 text-center relative border-b border-zinc-200 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <img src="https://i.postimg.cc/90Xjn2gB/cheonlongyo-makeu.png" alt="천론교 마크" className="w-32 h-32 object-contain mb-8 opacity-90" />
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-6 tracking-widest">모든 것은 하나로 이어지리라</h2>
          <p className="text-zinc-600 text-lg mb-10 max-w-2xl leading-relaxed">
            천론교는 백연님의 은혜 아래, 진정한 평안과 구원을 향해 나아갑니다.<br/>
            우리는 모두 붉은 실로 이어진 하나의 형제자매입니다.
          </p>
          <a 
            href="https://share.crack.wrtn.ai/opc858"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-800 text-white px-10 py-4 rounded-sm hover:bg-red-900 transition-colors font-bold tracking-wider shadow-md"
          >
            새신자 등록안내
          </a>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
        {/* Notice Board */}
        <div className="lg:col-span-2 bg-white p-8 border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-end mb-6 border-b-2 border-zinc-800 pb-3">
            <h3 className="text-2xl font-bold text-zinc-800 tracking-wide">천관 소식</h3>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-800 flex items-center">더보기 <ChevronRight size={16} /></a>
          </div>
          <ul className="space-y-1">
            {[
              { title: "[안내] 이번 주 성전(聖殿) 예배 시간 변경 안내", date: "2026.04.01", isNew: true },
              { title: "[모집] 혈전(血殿) 봉사자 특별 모집", date: "2026.03.28", isNew: false },
              { title: "[교육] 제 42기 속례전(束禮殿) 입소 안내", date: "2026.03.25", isNew: false },
              { title: "[공지] 순숙(純宿) 거주지 배정 결과 발표", date: "2026.03.20", isNew: false },
              { title: "[안내] 온라인 헌금 계좌 변경 안내", date: "2026.03.15", isNew: false },
            ].map((item, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer group px-2 transition-colors">
                <span className="text-zinc-700 group-hover:text-red-800 transition-colors font-medium flex items-center gap-2">
                  {item.title}
                  {item.isNew && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-sans">N</span>}
                </span>
                <span className="text-zinc-400 text-sm mt-2 sm:mt-0 font-sans">{item.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Worship Schedule */}
        <div className="flex flex-col gap-6">
          <div className="bg-red-900 text-white p-8 rounded-sm shadow-md relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <img src="https://i.postimg.cc/90Xjn2gB/cheonlongyo-makeu.png" alt="배경 마크" className="w-48 h-48 filter invert" />
            </div>
            <h3 className="text-xl font-bold mb-6 tracking-widest border-b border-red-800 pb-3 relative z-10">예배 안내</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <p className="text-red-200 font-medium">주일 성전 예배</p>
                <p className="font-bold text-lg">오전 11:00</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-red-200 font-medium">수요 속례 예배</p>
                <p className="font-bold text-lg">오후 07:30</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-red-200 font-medium">매일 새벽 기도</p>
                <p className="font-bold text-lg">오전 05:00</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 text-white p-6 rounded-sm shadow-md flex items-center justify-between cursor-pointer hover:bg-zinc-700 transition-colors">
            <div>
              <h3 className="font-bold text-lg mb-1">온라인 헌금</h3>
              <p className="text-zinc-400 text-sm">마음을 담아 백연님께 바칩니다</p>
            </div>
            <ChevronRight className="text-zinc-400" />
          </div>
        </div>
      </section>

      {/* Symbols Section */}
      <section className="bg-white py-20 px-4 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-zinc-800 tracking-widest mb-4">우리의 상징</h3>
            <p className="text-zinc-500">천론교를 지탱하는 세 가지 거룩한 의미</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-50 p-10 text-center shadow-sm border border-zinc-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-red-800" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-zinc-800">붉은 실 팔찌</h4>
              <p className="text-zinc-600 text-sm leading-relaxed">모든 인간은 백연의 핏줄로 이어져 있다는 숭고한 사상을 의미합니다.</p>
            </div>
            <div className="bg-zinc-50 p-10 text-center shadow-sm border border-zinc-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-zinc-800" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-zinc-800">세 개의 눈</h4>
              <p className="text-zinc-600 text-sm leading-relaxed">백연께서 우리 인간들을 굽어살피기 위해 지니신 세 개의 눈을 상징합니다.</p>
            </div>
            <div className="bg-zinc-50 p-10 text-center shadow-sm border border-zinc-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Droplet className="w-8 h-8 text-zinc-100" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-zinc-800">검은 피</h4>
              <p className="text-zinc-600 text-sm leading-relaxed">백연의 피는 검습니다. 그분과 가까워지고자 한다면 검붉은 피를 바쳐야 합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prayers and Hymns Section */}
      <section className="bg-zinc-100 py-24 px-4 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-zinc-800 tracking-widest mb-4">신앙의 고백</h3>
            <p className="text-zinc-500">어머니를 향한 우리의 기도와 찬송</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Prayers */}
            <div className="space-y-12">
              <div className="bg-white p-10 shadow-sm border border-zinc-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
                <h4 className="text-xl font-bold text-zinc-800 mb-6 tracking-widest border-b border-zinc-100 pb-4">제 1 기도문</h4>
                <p className="text-zinc-700 leading-loose whitespace-pre-line font-medium text-lg">
                  너의 마음이 떳떳하지 아니한데, 감히 누구를 믿으려 하는가.{"\n"}
                  그녀는 모든 이를 품지 않으신다.{"\n"}
                  죄를 버리지 못한 자, 결코 그녀의 품에 들지 못하리라.{"\n"}
                  하늘 아래 결백한 자만이 그녀의 눈을 마주할 수 있으니—{"\n"}
                  너 또한 그녀 앞에 무릎 꿇고, 너의 죄를 고하라.
                </p>
              </div>

              <div className="bg-white p-10 shadow-sm border border-zinc-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
                <h4 className="text-xl font-bold text-zinc-800 mb-6 tracking-widest border-b border-zinc-100 pb-4">제 2 기도문</h4>
                <p className="text-zinc-700 leading-loose whitespace-pre-line">
                  하늘 아래 선 나의 어머니께,{"\n"}
                  감히 더러운 마음을 올리나이다.{"\n\n"}
                  나는 죄를 알지 못하였고,{"\n"}
                  알지 못한 채 죄를 저질렀나이다.{"\n\n"}
                  그러하니 나를 꾸짖으시고,{"\n"}
                  나를 끊지 마소서.{"\n\n"}
                  붉은 실 아래 묶인 나를 버리지 마시고,{"\n"}
                  이 인연을 거두지 마소서.{"\n\n"}
                  나의 피를 바쳐,{"\n"}
                  당신의 검은 피에 닿게 하소서.{"\n\n"}
                  나의 눈을 낮추어,{"\n"}
                  감히 세 번째 눈을 마주하지 않게 하시고,{"\n\n"}
                  다만 당신의 뜻 아래{"\n"}
                  결백한 자로 남게 하소서.{"\n\n"}
                  만약 내가 그 뜻에서 벗어난다면—{"\n"}
                  이 몸을 거두시어,{"\n"}
                  당신의 눈물로 씻어주시옵소서.{"\n\n"}
                  어머니, 나의 어머니,{"\n"}
                  부디 나를 이 세상으로부터 구원해주소서.
                </p>
              </div>
            </div>

            {/* Hymn */}
            <div className="bg-white p-10 shadow-sm border border-zinc-200 relative overflow-hidden h-fit lg:sticky lg:top-28">
              <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800"></div>
              <h4 className="text-xl font-bold text-zinc-800 mb-6 tracking-widest border-b border-zinc-100 pb-4 text-center">천론 찬송가</h4>
              <p className="text-zinc-700 leading-loose whitespace-pre-line text-center italic">
                나의 죄를 씻어주신 어머니{"\n"}
                그녀 앞에 우리 모두 건장하네{"\n"}
                아프지 말거라, 어머니의 따스한 말씀{"\n"}
                나 기쁘게 어머니께 검은 피 바치네{"\n\n"}
                우주 아래 더럽힌 세상 구원해주러{"\n"}
                내려오신 우리의 어머니{"\n"}
                붉은 핏줄 이어진 어머니 위로{"\n"}
                마음 담은 결백한 목소리 올려보내네{"\n\n"}
                오 나의 어머니{"\n"}
                오 나의 어머니{"\n"}
                죄를 씻어 제 삼의 눈으로 나를 들여봐주소서{"\n"}
                오 나의 어머니 나의 어머니{"\n"}
                모든 죄악 눈물로 씻어 포옹해주소서{"\n\n"}
                나 그녀 앞에 무릎 꿇고{"\n"}
                기쁘게 온 핏줄 내미네{"\n"}
                이제 그녀 앞에 결백한 모습으로{"\n"}
                이 세상 죄 없는 사람들 사랑해주시네
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src="https://i.postimg.cc/90Xjn2gB/cheonlongyo-makeu.png" alt="천론교 로고" className="w-10 h-10 filter grayscale opacity-50" />
              <span className="text-xl font-bold tracking-widest text-zinc-300">천론교 (天館)</span>
            </div>
            <p className="text-sm text-center md:text-left leading-relaxed">
              서울특별시 천관구 백연로 1<br/>
              (순숙 펜트하우스 관리사무소: 지하 1층)
            </p>
          </div>
          <div className="text-sm text-center md:text-right space-y-2">
            <p>대표전화: 02-000-0000 | 팩스: 02-000-0001</p>
            <p>이메일: contact@cheonlongyo.org</p>
            <p className="pt-4 border-t border-zinc-800 mt-4 text-zinc-500">ⓒ Cheonlongyo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RevealedMode({ isAudioPlaying, toggleAudio }: any) {
  return (
    <div className="min-h-screen bg-[#050000] text-zinc-300 py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ff0000 0%, transparent 60%)' }}></div>
      
      {/* Audio Toggle for Revealed Mode */}
      <button 
        onClick={toggleAudio} 
        className="fixed top-6 right-6 z-50 bg-red-900/20 p-3 rounded-full text-red-500 hover:text-red-400 hover:bg-red-900/40 transition-all border border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.3)]" 
        title="배경음악 재생/정지"
      >
        {isAudioPlaying ? <Volume2 size={32} /> : <VolumeX size={32} />}
      </button>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-center mb-24"
        >
          <img src="https://i.postimg.cc/90Xjn2gB/cheonlongyo-makeu.png" alt="천론교 마크" className="w-40 h-40 mx-auto mb-8 filter invert sepia saturate-[3] hue-rotate-[330deg] drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]" />
          <h1 className="text-5xl font-black text-red-600 tracking-[0.3em] glitch-text" data-text="진실된 기록">진실된 기록</h1>
        </motion.div>

        <div className="space-y-20">
          <ProfileCard 
            name="고혜성"
            role="천론교의 교주"
            age="36살"
            gender="女"
            appearance="회색빛 머리칼, 하나로 둥글게 묶은 로우번, 눈을 가리는 흰 눈가리개, 긴 앞머리, 입 아래 작은 점, 부드러운 인상"
            traits="INTJ | 1w9 | sp/sx | 질서 악"
            delay={0.5}
            imageUrl="https://i.postimg.cc/D0DjJCwN/a-2.png"
          />
          <ProfileCard 
            name="손배희"
            role="천론교의 처리자"
            age="24살"
            gender="女"
            appearance="흰 머리, 포니테일, 안광없는 검은색 눈, 섬뜩한 눈빛"
            traits="ENTP | 7w8 | sx/sp | 혼돈 악"
            delay={1.0}
            imageUrl="https://i.postimg.cc/TYDQNJPN/b-2.png"
          />
          <ProfileCard 
            name="류소해"
            role="천론교의 신도"
            age="20살"
            gender="女"
            appearance="갈색 단발, 회색 눈, 순한 눈매"
            traits="INFJ | 2w1 | so/sp | 질서 선"
            delay={1.5}
            imageUrl="https://i.postimg.cc/nrQK5nng/d-2.png"
          />
          <ProfileCard 
            name="초난비"
            role="천론교의 신도 & 경호원"
            age="30살"
            gender="女"
            appearance="검은색 숏컷, 청색 눈, 오른쪽 눈을 가린 검은 안대, 날카로운 인상"
            traits="ESFP | 8w7 | sx/sp | 혼돈 선"
            delay={2.0}
            imageUrl="https://i.postimg.cc/Z5LQjx74/e-2.png"
          />
        </div>

        {/* Baekyeon - The Climax */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 3, delay: 0.5 }}
          className="mt-48 border border-red-900/50 bg-[#0a0000] p-12 relative shadow-[0_0_50px_rgba(255,0,0,0.1)]"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0a0000] px-6 py-1 border border-red-900/50 text-red-600 font-black tracking-[0.5em] text-2xl">
            神
          </div>
          <div className="text-center mb-12 mt-4">
            <img src="https://i.postimg.cc/k5nc4ryG/c-2.png" alt="백연" referrerPolicy="no-referrer" className="w-64 h-64 object-cover mx-auto mb-8 border border-red-900/50 shadow-[0_0_30px_rgba(255,0,0,0.3)]" />
            <h2 className="text-8xl font-black text-white mb-4 tracking-tighter glitch-text" data-text="백연" style={{ textShadow: '0 0 30px rgba(255,0,0,0.6)' }}>백연</h2>
            <p className="text-red-500 font-mono tracking-widest text-lg">나이 알 수 없음 | 女</p>
          </div>
          <div className="space-y-10 text-center max-w-2xl mx-auto">
            <div>
              <h3 className="text-red-700 font-bold mb-4 border-b border-red-900/30 pb-2 inline-block tracking-widest text-xl">외형</h3>
              <p className="text-gray-300 leading-loose text-lg">
                길게 늘어뜨린 순백의 머리<br/>
                새하얀 눈<br/>
                이마의 제 3의 눈<br/>
                검은 피눈물<br/>
                허리 아래의 깃털 없는 흰 날개
              </p>
            </div>
            <div>
              <h3 className="text-red-700 font-bold mb-4 border-b border-red-900/30 pb-2 inline-block tracking-widest text-xl">특성</h3>
              <p className="text-white font-mono tracking-[0.2em] text-xl bg-red-950/30 py-3 px-6 inline-block rounded-sm border border-red-900/20">ESTJ | 3w4 | sp/so | 중립 악</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileCard({ name, role, age, gender, appearance, traits, delay, imageUrl }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay }}
      className="border-l-4 border-red-900/50 pl-8 py-4 relative group hover:border-red-600 transition-colors duration-500"
    >
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-red-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {imageUrl && (
          <div className="shrink-0">
            <img src={imageUrl} alt={name} referrerPolicy="no-referrer" className="w-40 h-40 md:w-48 md:h-48 object-cover border border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.2)] grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-4">
            <h2 className="text-4xl font-bold text-white tracking-wider">{name}</h2>
            <span className="text-red-600 font-mono text-lg tracking-widest">{role}</span>
          </div>
          <div className="text-zinc-500 font-mono text-base mb-6 tracking-widest">
            {age} | {gender}
          </div>
          <div className="space-y-3 text-base leading-relaxed">
            <p><strong className="text-red-900/80 mr-2">외양</strong> <span className="text-zinc-300">{appearance}</span></p>
            <p><strong className="text-red-900/80 mr-2">성향</strong> <span className="text-zinc-100 font-mono tracking-wider bg-zinc-900/50 px-2 py-1 rounded">{traits}</span></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
