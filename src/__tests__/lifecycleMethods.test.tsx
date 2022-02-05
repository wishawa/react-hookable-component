/**
 * @jest-environment jsdom
 */
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HookablePureComponent } from '..';
import { useState } from 'react';
type LifecycleItem =
	| 'constructor'
	| 'componentDidUpdate'
	| 'getSnapshotBeforeUpdate'
	| 'render'
	| 'clicked'
	| 'hookUpdate';
class TestComponent extends HookablePureComponent<
	{ box: LifecycleItem[] },
	{ s: number }
> {
	constructor(props: { box: LifecycleItem[] }) {
		super(props);
		this.state = {
			s: 1,
		};
		props.box.push('constructor');
	}
	componentDidUpdate(
		_prevProps: { box: LifecycleItem[] },
		_prevState: { s: number },
		snapshot: number
	) {
		if (snapshot !== 123) throw new Error('bad snapshot');
		this.props.box.push('componentDidUpdate');
	}
	getSnapshotBeforeUpdate() {
		this.props.box.push('getSnapshotBeforeUpdate');
		return 123;
	}
	render() {
		this.props.box.push('render');
		const [st, setSt] = useState(42);
		return (
			<div>
				<button
					onClick={() => {
						this.props.box.push('clicked');
						this.setState({ s: this.state.s + 1 });
					}}
				>
					u
				</button>
				<button
					onClick={() => {
						this.props.box.push('hookUpdate');
						setSt((x) => x * 2);
					}}
				>
					v
				</button>
			</div>
		);
	}
}
test('lifecycle', async () => {
	const box: LifecycleItem[] = [];
	render(<TestComponent box={box} />);
	const AFTER_MOUNT: LifecycleItem[] = ['constructor', 'render'];
	expect(box).toEqual(AFTER_MOUNT);
	const button = screen.getByRole('button', { name: 'u' });
	fireEvent.click(button);
	const AFTER_UPDATE: LifecycleItem[] = [
		...AFTER_MOUNT,
		'clicked',
		'render',
		'getSnapshotBeforeUpdate',
		'componentDidUpdate',
	];
	expect(box).toEqual(AFTER_UPDATE);
	fireEvent.click(screen.getByRole('button', { name: 'v' }));
	const AFTER_SECOND_UPDATE: LifecycleItem[] = [
		...AFTER_UPDATE,
		'hookUpdate',
		'render',
		'getSnapshotBeforeUpdate',
		'componentDidUpdate',
	];
	expect(box).toEqual(AFTER_SECOND_UPDATE);
});
