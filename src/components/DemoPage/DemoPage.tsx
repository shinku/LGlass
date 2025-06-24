
import React, { CSSProperties, useState } from 'react';
import { LGlass } from '../LGlass/LGlass';
import img from './../../assets/react.svg';
import './App.css';
export const DemoApp = React.memo(() => {
  const featuredApps = [
    {
      id: 1,
      name: 'Procreate',
      category: '创意',
      rating: 4.8,
      icon: 'https://example.com/procreate-icon.png',
      bgColor: '#3A3A3C'
    },
    {
      id: 2,
      name: 'Notability',
      category: '生产力',
      rating: 4.7,
      icon: 'https://example.com/notability-icon.png',
      bgColor: '#2C2C2E'
    },
    {
      id: 3,
      name: 'Darkroom',
      category: '照片与视频',
      rating: 4.9,
      icon: 'https://example.com/darkroom-icon.png',
      bgColor: '#3A3A3C'
    }
  ];
  const [glassStyle,setGlassStyle] = useState<CSSProperties>({
    width: "10px",
    height:"10px"
  })
 
  const onClick = (e:React.MouseEvent<HTMLDivElement>)=>{
      const rect = e.currentTarget.getBoundingClientRect();
      const localX = e.clientX - rect.left; // 视口坐标 - 元素左边距
      const localY = e.clientY - rect.top;  // 视口坐标 - 元素上边距
      console.log("手动计算坐标:", localX, localY);
      setGlassStyle(sty=>{
        return {
          ...sty,
          left: (localX)+"px",
          top: (localY)+"px"
        }
      })
    }
  const [showIntro,setShowIntro] = useState(false)
  return (
    <div className="app-store" id='stage' style={{
      position:"relative"
    }} onClick={onClick}>
      {/* 顶部导航栏 */}
      <header className="app-header" style={{position:"relative"}}>
        <div className="header-content" >
          <h1 className="app-title">APP MARKET</h1>
          <nav className="app-nav">
            <a href="#" className="nav-link active">今日</a>
            <a href="#" className="nav-link">游戏</a>
            <a href="#" className="nav-link">应用</a>
            <a href="#" className="nav-link">更新</a>
            <a href="#" className="nav-link">搜索</a>
            
          </nav>
          
          <div className="user-avatar">👤</div>
        </div>
        
      </header>
      
      {/* 主要内容区 */}
      <main className="app-content">
        {/* 特色横幅 */}
        <section className="feature-banner" style={{ backgroundColor: '#0071E3' }}>
          <div className="banner-content">
            <h2>本周精选</h2>
            <p>发现本周最受欢迎的应用</p>
            <button className="app-button" style={{display: "relative"}} onClick={()=>setShowIntro((val)=>!val)}>
              查看全部
             
            </button>
          </div>
        </section>

        {/* 推荐应用部分 */}
        {
          showIntro && <section className="featured-section">
          <h3 className="section-title">为你推荐</h3>
          <div className="apps-grid">
            {featuredApps.map(app => (
              <div key={app.id} className="app-card" style={{ backgroundColor: app.bgColor }}>
                <div className="app-icon">
                  <img src={app.icon} alt={app.name} />
                </div>
                <div className="app-info">
                  <h4>{app.name}</h4>
                  <p className="app-category">{app.category}</p>
                  <div className="app-rating">⭐ {app.rating}</div>
                </div>
                <button className="get-button">获取</button>
              </div>
            ))}
          </div>
        </section>
        }
        

        {/* 快速链接 */}
        <section className="quick-links">
          <a href="#" className="quick-link"  >Apple Arcade 
            
          </a>
          <a href="#" className="quick-link" style={{position:'relative'}} >
           
            故事
          </a>
          <a href="#" className="quick-link">活动</a>
        </section>
      </main>

      {/* 底部标签栏 */}
      <div className="app-footer" style={{
        background:"url("+img+")",
        position:"relative",

      }}>
        <a href="#" className="tab-item active">Today </a>
        <a href="#" className="tab-item">Games</a>
       
      </div>
      <LGlass style={glassStyle} rootComponent={document.getElementById('stage') || document.body}></LGlass>
    </div>
  );
});
