import './styles/main.css';
import initApp from './components/app_ui/AppManager.js';

document.body.style.visibility = 'hidden';
window.addEventListener('load', () => {
    document.body.style.visibility = 'visible';
});

initApp();
