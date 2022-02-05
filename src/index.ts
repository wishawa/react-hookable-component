import {
	createElement,
	useLayoutEffect,
	Component,
	PureComponent,
} from 'react';
import type { ReactElement } from 'react';

/* tslint:disable:max-classes-per-file */

export function makeHookable<P = {}, S = {}, SS = any>(
	self: Component<P, S, SS>
) {
	const origRender = self.render.bind(self);
	const origCdu = self.componentDidUpdate?.bind(self);
	let isParentRendering: boolean = false;
	let snapshot: undefined | SS;
	const layoutEffect = () => {
		if (!isParentRendering) origCdu?.(self.props, self.state, snapshot);
		isParentRendering = false;
	};
	const elemFunc = () => {
		const res = origRender();
		if (!isParentRendering)
			snapshot =
				self.getSnapshotBeforeUpdate?.(self.props, self.state) ?? undefined;
		useLayoutEffect(layoutEffect);
		return res;
	};
	self.render = () => {
		isParentRendering = true;
		return createElement(elemFunc as () => ReactElement<{}>, null);
	};
}

export class HookableComponent<P = {}, S = {}, SS = any> extends Component<
	P,
	S,
	SS
> {
	constructor(props: P) {
		super(props);
		makeHookable(this);
	}
}
export class HookablePureComponent<
	P = {},
	S = {},
	SS = any
> extends PureComponent<P, S, SS> {
	constructor(props: P) {
		super(props);
		makeHookable(this);
	}
}
