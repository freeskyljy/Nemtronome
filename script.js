const video = document.getElementById('video');
const bpmSlider = document.getElementById('bpmSlider');
const bpmValue = document.getElementById('bpmValue');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const beatLights = document.getElementById('beatLights');

const soundNormal = document.getElementById('soundNormal');
const soundDownbeat = document.getElementById('soundDownbeat');

const originalBPM = 73; // 원본 영상 BPM
let bpm = 100;
let beatsPerBar = 4;
let currentBeat = 0;
let timer = null;

// 불빛 만들기
for (let i = 0; i < beatsPerBar; i++) {
  const div = document.createElement('div');
  div.className = 'beat-light';
  div.textContent = i + 1;
  beatLights.appendChild(div);
}
const lights = document.querySelectorAll('.beat-light');

function playClick(isDownbeat) {
  const sound = (isDownbeat ? soundDownbeat : soundNormal).cloneNode(true);
  sound.currentTime = 0;
  sound.play();
}

function updateBeat() {
  lights.forEach(l => l.classList.remove('active'));
  lights[currentBeat].classList.add('active');

  const isDownbeat = currentBeat === 0;
  playClick(isDownbeat);

  // 다운비트일 때 영상 리셋
  if (isDownbeat) {
    video.currentTime = 0;
    video.play();
  }

  currentBeat = (currentBeat + 1) % beatsPerBar;
}

function startMetronome() {
  if (timer) return;
  bpm = parseInt(bpmSlider.value);

  // 영상 속도 조절
  video.playbackRate = bpm / originalBPM;
  video.currentTime = 0;
  video.play();

  const interval = 60000 / bpm;
  updateBeat(); // 첫 박자
  timer = setInterval(updateBeat, interval);
}

function stopMetronome() {
  clearInterval(timer);
  timer = null;
  video.pause();
}

function resetMetronome() {
  stopMetronome();
  currentBeat = 0;
  lights.forEach(l => l.classList.remove('active'));
  video.currentTime = 0;
}

// 이벤트 연결
bpmSlider.addEventListener('input', () => {
  bpmValue.textContent = bpmSlider.value;
  if (timer) {
    stopMetronome();
    startMetronome();
  }
});

playBtn.onclick = startMetronome;
stopBtn.onclick = stopMetronome;
resetBtn.onclick = resetMetronome;
