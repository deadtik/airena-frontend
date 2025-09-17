// app/components/SocialEmbedRenderer.tsx
"use client";
import React, { useEffect } from 'react';

// TypeScript declarations for external scripts
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface SocialEmbedRendererProps {
  content: string;
}

const SocialEmbedRenderer: React.FC<SocialEmbedRendererProps> = ({ content }) => {
  useEffect(() => {
    // Process social embeds after content is rendered
    const embedElements = document.querySelectorAll('[data-social-embed]');
    
    embedElements.forEach((element) => {
      const src = element.getAttribute('data-src');
      const type = element.getAttribute('data-type');
      
      if (!src || !type) return;
      
      let embedHtml = '';
      
      switch (type) {
        case 'twitter':
          embedHtml = `
            <blockquote class="twitter-tweet" data-theme="dark">
              <a href="${src}"></a>
            </blockquote>
          `;
          break;
          
        case 'youtube':
          const youtubeId = extractYouTubeId(src);
          if (youtubeId) {
            embedHtml = `
              <div class="relative w-full" style="padding-bottom: 56.25%;">
                <iframe 
                  src="https://www.youtube.com/embed/${youtubeId}" 
                  frameborder="0" 
                  allowfullscreen
                  class="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
            `;
          }
          break;
          
        case 'instagram':
          embedHtml = `
            <blockquote 
              class="instagram-media" 
              data-instgrm-permalink="${src}" 
              data-instgrm-version="14"
              style="background:#000; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
              <div style="padding:16px;">
                <a href="${src}" style="background:#FFFFFF; line-height:0; padding:0; text-align:center; text-decoration:none; width:100%;" target="_blank">
                  View this post on Instagram
                </a>
              </div>
            </blockquote>
          `;
          break;
      }
      
      if (embedHtml) {
        element.innerHTML = embedHtml;
      }
    });
    
    // Load external scripts for embeds
    loadTwitterScript();
    loadInstagramScript();
    
  }, [content]);

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const loadTwitterScript = () => {
    if (!document.querySelector('script[src*="twitter.com/widgets.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    } else if (window.twttr) {
      window.twttr.widgets.load();
    }
  };

  const loadInstagramScript = () => {
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  };

  return (
    <div
      className="prose prose-invert prose-lg max-w-none 
                 prose-p:text-gray-300 prose-p:leading-relaxed
                 prose-h2:text-emerald-400 prose-h2:font-semibold
                 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/10
                 prose-li:text-gray-300"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default SocialEmbedRenderer;