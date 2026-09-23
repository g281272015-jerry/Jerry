/**
 * 全站音效引擎
 * ------------------------------------------------------------
 * 用 Web Audio API 现场合成短促的"游戏按键音",不需要任何音频
 * 文件——所以不用担心版权、也不用担心加载慢。打字音效每个字符
 * 音调会有一点点随机浮动,听起来更像真的在敲键盘,而不是每次
 * 都一模一样的死板电子音。
 *
 * 浏览器规定:音频必须在用户产生过一次真实交互(点一下/按一个键)
 * 之后才允许播放,所以这里会在页面第一次点击/按键时自动"解锁"。
 *
 * 想关掉全站音效:调用 setMuted(true) 就行,状态会记到浏览器本地,
 * 下次打开还是关着的。
 */

const STORAGE_KEY = "ls-sound-muted";

// 全站音量统一在这里调——1 = 原始音量,1.5 就是整体提高 50%。
// 想以后再调大/调小,改这一个数字就行,不用一个个去改每个音效。
const MASTER_VOLUME = 1.5;

let ctx = null;
let unlocked = false;

let muted = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
})();

function getCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

export function unlockAudio() {
  if (unlocked) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  unlocked = true;
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* 存不了就算了,不影响使用 */
  }
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

// 最基础的"短促合成音"——一个振荡器 + 一段快速衰减的音量包络,
// 声音干净利落,很像机械键盘"哒"的一下
function blip({ freq = 700, duration = 0.05, type = "square", gain = 0.05, decay = 0.05 }) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  unlockAudio();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  // 音量在这里统一乘上 MASTER_VOLUME,所有音效(点击/打字/滚轮)
  // 一起变大,彼此的相对大小关系不会变
  g.gain.setValueAtTime(gain * MASTER_VOLUME, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + decay);
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

// 一段很短的白噪声,经过带通滤波之后能模拟机械键盘轴那种
// 塑料碰撞的"哒"声——跟单纯的振荡器音色比,这个更接近真实键盘
function noiseBurst({ duration = 0.015, gain = 0.05, filterFreq = 3000, filterType = "bandpass", filterQ = 1.4 }) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  unlockAudio();

  const sampleCount = Math.max(1, Math.floor(c.sampleRate * duration));
  const buffer = c.createBuffer(1, sampleCount, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  filter.Q.value = filterQ;

  const g = c.createGain();
  g.gain.setValueAtTime(gain * MASTER_VOLUME, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);

  noise.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  noise.start();
  noise.stop(c.currentTime + duration);
}

/** 按钮 / 链接点击音——偏低沉扎实,像按下一个实体键 */
export function playClick() {
  blip({ freq: 320, duration: 0.06, type: "square", gain: 0.06, decay: 0.07 });
  setTimeout(() => blip({ freq: 900, duration: 0.02, type: "square", gain: 0.028, decay: 0.02 }), 8);
}

/** 手风琴开关那种小拨片音效,比普通点击更清脆一点 */
export function playToggleSwitch() {
  blip({ freq: 520, duration: 0.05, type: "triangle", gain: 0.05, decay: 0.06 });
}

/** 打字机每敲一个字符调用一次——换成了"机械键盘"的音色:
 * 先是一下高频的塑料碰撞声(轴体开关的"哒"),紧接着一个很短的
 * 低音"咚"(按键触底的声音),两个叠在一起听起来才有实体键盘的
 * 分量感,不再是单纯的电子哔哔声。每次音调都有一点点随机浮动,
 * 不会死板重复。 */
export function playType() {
  const jitter = 1 + (Math.random() - 0.5) * 0.3;
  noiseBurst({ duration: 0.014, gain: 0.09, filterFreq: 3200 * jitter, filterType: "bandpass", filterQ: 1.6 });
  setTimeout(() => {
    blip({ freq: 165 * jitter, duration: 0.03, type: "square", gain: 0.04, decay: 0.03 });
  }, 4);
}

/** 结尾视频"滚轮滑动播放"的时候用——每滑动一点就"哒"一下,
 * 像老式胶片卷片器/机械滚轮的手感,音调比打字音效低一些、更沉一点,
 * 用锯齿波音色区分开,不会跟打字音效混在一起听不出来 */
export function playScrollTick() {
  const jitter = 1 + (Math.random() - 0.5) * 0.4;
  blip({ freq: 260 * jitter, duration: 0.03, type: "sawtooth", gain: 0.045, decay: 0.035 });
}

// 页面里第一次点击/按键,顺便解锁一次音频上下文
if (typeof window !== "undefined") {
  const unlockOnce = () => {
    unlockAudio();
    window.removeEventListener("pointerdown", unlockOnce);
    window.removeEventListener("keydown", unlockOnce);
  };
  window.addEventListener("pointerdown", unlockOnce, { once: true });
  window.addEventListener("keydown", unlockOnce, { once: true });
}
