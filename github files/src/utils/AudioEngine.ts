class WebAudioEngine {
  private isMuted: boolean = false;
  private ytPlayer: any = null;
  private isInitialized: boolean = false;
  private targetVolume: number = 60; // 60% Volume Level strictly

  public getIsMuted() {
    return this.isMuted;
  }

  public setVolume(volume: number) {
    this.targetVolume = volume;
    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(volume);
      } catch (e) { }
    }
    this.sendIframeCommand('setVolume', [volume]);
  }

  private sendIframeCommand(func: string, args: any[] = []) {
    try {
      const iframe = (document.querySelector('#interstellar-yt-container iframe') as HTMLIFrameElement) || 
                     (document.querySelector('iframe[src*="youtube"]') as HTMLIFrameElement);
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch (e) {}
  }

  public initYtAudio() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // 1. Create container iframe div if not present
      let container = document.getElementById('interstellar-yt-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'interstellar-yt-container';
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '1px';
        container.style.height = '1px';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';

        const iframeDiv = document.createElement('div');
        iframeDiv.id = 'interstellar-yt-player';
        container.appendChild(iframeDiv);
        document.body.appendChild(container);
      }

      // 2. Load YouTube Iframe API Script
      if (!(window as any).YT || !(window as any).YT.Player) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }

        const prevReady = (window as any).onYouTubeIframeAPIReady;
        (window as any).onYouTubeIframeAPIReady = () => {
          if (prevReady) prevReady();
          this.createPlayer();
        };
      } else {
        this.createPlayer();
      }

      this.attachTabVisibilityListeners();
    } catch (err) {
      console.warn('YouTube audio init error:', err);
    }
  }

  private createPlayer() {
    if (this.ytPlayer || !(window as any).YT || !(window as any).YT.Player) return;

    try {
      this.ytPlayer = new (window as any).YT.Player('interstellar-yt-player', {
        height: '1',
        width: '1',
        videoId: 'dLxja_YEUVw',
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: 'dLxja_YEUVw',
          start: 4,
          enablejsapi: 1
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.setVolume(this.targetVolume);
              event.target.seekTo(4, true);
              if (!this.isMuted && !document.hidden) {
                event.target.unMute();
                event.target.playVideo();
              } else {
                event.target.mute();
                event.target.pauseVideo();
              }
            } catch (e) { }
          },
          onStateChange: (event: any) => {
            try {
              // 0 = YT.PlayerState.ENDED -> Auto-repeat background track from start
              if (event.data === 0 || (window as any).YT && event.data === (window as any).YT.PlayerState?.ENDED) {
                if (!this.isMuted && !document.hidden) {
                  event.target.seekTo(4, true);
                  event.target.playVideo();
                }
              }
            } catch (e) { }
          }
        }
      });
    } catch (e) {
      console.warn('Error creating YT player:', e);
    }
  }

  private attachTabVisibilityListeners() {
    const handleTabHide = () => {
      this.pauseAll();
    };

    const handleTabShow = () => {
      if (!this.isMuted && !document.hidden) {
        this.playAudio();
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) handleTabHide();
      else handleTabShow();
    });

    window.addEventListener('blur', handleTabHide);
    window.addEventListener('focus', handleTabShow);
    window.addEventListener('pagehide', handleTabHide);
    window.addEventListener('pageshow', handleTabShow);
  }

  public playAudio() {
    if (document.hidden || this.isMuted) return;
    this.initYtAudio();

    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.setVolume(this.targetVolume);
        this.ytPlayer.unMute();
        this.ytPlayer.playVideo();
      } catch (e) { }
    }
    this.sendIframeCommand('setVolume', [this.targetVolume]);
    this.sendIframeCommand('unMute');
    this.sendIframeCommand('playVideo');
  }

  public pauseAll() {
    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
        this.ytPlayer.mute();
      } catch (e) { }
    }
    this.sendIframeCommand('pauseVideo');
    this.sendIframeCommand('mute');
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.initYtAudio();

    if (muted) {
      this.pauseAll();
    } else {
      this.playAudio();
    }
  }

  public toggleSound() {
    const nextMuted = !this.isMuted;
    this.setMuted(nextMuted);
    return nextMuted;
  }

  public init() {
    this.initYtAudio();

    if (!this.isMuted && !document.hidden) {
      this.playAudio();
    }

    const unlockAudio = () => {
      this.initYtAudio();
      if (!this.isMuted && !document.hidden) {
        this.playAudio();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('touchend', unlockAudio);
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('scroll', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio, { passive: true });
    document.addEventListener('touchend', unlockAudio, { passive: true });
    document.addEventListener('pointerdown', unlockAudio, { passive: true });
    document.addEventListener('scroll', unlockAudio, { passive: true });
  }

  public resume() {
    this.initYtAudio();
    if (!this.isMuted && !document.hidden) {
      this.playAudio();
    }
  }

  public startContinuousAtmosphere() {
    this.initYtAudio();
    if (!this.isMuted && !document.hidden) {
      this.playAudio();
    }
  }

  public stopContinuousAtmosphere() {
    this.pauseAll();
  }

  public playWireMovement(_pitch?: number) { }
  public playWireConnection(_pitch?: number) { }
  public playSignalRun() { }
  public playComponentActivation(_component?: string) { }
  public playFinalInitialization() { }
  public playCinematicLowResonance() { }
  public playIdentitySound() { }

  public playRoboticVoice(_text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stopAll() {
    this.pauseAll();
  }
}

export const AudioEngine = new WebAudioEngine();
