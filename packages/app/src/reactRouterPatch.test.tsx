/*
 * Guards the local react-router v6 backport of the 7.18.0 security fixes
 * (.yarn/patches/; see osv-scanner.toml). Backstage pins react-router-dom
 * ^6.30.2, and 7.x breaks entity tab links, so v6 is patched instead:
 * - GHSA-wrjc-x8rr-h8h6: "/\evil.com" style paths must stay on this origin.
 * - GHSA-337j-9hxr-rhxg: hydration errors may only rebuild built-in Error types.
 */
import { act, render } from '@testing-library/react';
import {
  BrowserRouter,
  Link,
  createBrowserRouter,
  resolvePath,
  useNavigate,
} from 'react-router-dom';

const MIXED = [
  '//evil.example',
  '\\\\evil.example',
  '/\\evil.example',
  '\\/evil.example',
];

function Go({ to }: { to: string }) {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(to)}>
      go
    </button>
  );
}

describe('react-router v6 security backport', () => {
  it('resolvePath collapses mixed leading separators', () => {
    for (const to of MIXED) {
      expect(resolvePath(to).pathname).toBe('/evil.example');
    }
  });

  it('useNavigate never pushes an off-origin URL', () => {
    const push = jest.spyOn(window.history, 'pushState');
    for (const to of MIXED) {
      push.mockClear();
      const { getByText, unmount } = render(
        <BrowserRouter>
          <Go to={to} />
        </BrowserRouter>,
      );
      act(() => getByText('go').click());
      const url = new URL(String(push.mock.calls[0][2]), window.location.href);
      expect(url.origin).toBe(window.location.origin);
      unmount();
    }
    push.mockRestore();
  });

  it('same-origin protocol-relative Link keeps backslashes in query and hash', () => {
    const push = jest.spyOn(window.history, 'pushState');
    const to = `//${window.location.host}/search?q=a\\b#h\\i`;
    const { getByText, unmount } = render(
      <BrowserRouter>
        <Link to={to}>x</Link>
      </BrowserRouter>,
    );
    act(() => getByText('x').click());
    expect(String(push.mock.calls[0][2])).toBe('/search?q=a\\b#h\\i');
    unmount();
    push.mockRestore();
  });

  it('Link treats backslash protocol-relative paths as external', () => {
    for (const to of ['/\\evil.example', '\\\\evil.example']) {
      const { container, unmount } = render(
        <BrowserRouter>
          <Link to={to}>x</Link>
        </BrowserRouter>,
      );
      const href = container.querySelector('a')!.getAttribute('href')!;
      // Rendered as the raw absolute href (a normal external link), never
      // routed client-side as if it were a path on this origin.
      expect(href).toBe(to);
      unmount();
    }
  });

  it('hydration only rebuilds built-in Error subtypes', () => {
    const Spy = jest.fn();
    (window as any).PwnCtor = Spy;
    (window as any).__staticRouterHydrationData = {
      loaderData: {},
      errors: {
        root: { __type: 'Error', __subType: 'PwnCtor', message: 'x' },
        other: { __type: 'Error', __subType: 'TypeError', message: 'y' },
      },
    };
    const router = createBrowserRouter([
      { id: 'root', path: '/' },
      { id: 'other', path: '/o' },
    ]);
    expect(Spy).not.toHaveBeenCalled();
    expect(router.state.errors?.root).toBeInstanceOf(Error);
    expect(router.state.errors?.other).toBeInstanceOf(TypeError);
    router.dispose();
    delete (window as any).PwnCtor;
    delete (window as any).__staticRouterHydrationData;
  });
});
