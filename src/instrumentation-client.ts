import { captureRouterTransitionStart, loadSentry } from 'helpers/monitoring';

const init = (): void => {
	void loadSentry();
};

if ('requestIdleCallback' in window) {
	requestIdleCallback(init, { timeout: 4000 });
} else {
	setTimeout(init, 2000);
}

export const onRouterTransitionStart = captureRouterTransitionStart;
