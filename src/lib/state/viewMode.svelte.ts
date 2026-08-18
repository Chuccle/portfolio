/**
 * The site has two faces: an ordinary accessible page (the default, for
 * everyone) and an optional WinDbg-styled terminal (opt-in, for people who
 * want the gimmick). This is the single switch between them.
 *
 * Nothing terminal-related — the 3D scene, the boot sequence, the command
 * session — is mounted or started until a visitor explicitly asks for it.
 */
export type ViewMode = 'page' | 'terminal';

class ViewModeStore {
	current = $state<ViewMode>('page');
	/** True once the visitor has opened the terminal at least once. */
	everOpened = $state(false);

	enterTerminal() {
		this.current = 'terminal';
		this.everOpened = true;
	}

	exitTerminal() {
		this.current = 'page';
	}
}

export const viewMode = new ViewModeStore();
