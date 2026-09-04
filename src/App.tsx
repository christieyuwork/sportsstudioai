import { CakeProvider } from '@cake-admin/cakeand';
import { SignInPage } from './pages/SignInPage';

/**
 * App root.
 *
 * Theme mode MUST stay in sync with data-theme on <html> in index.html
 * (see cake& AGENTS.md). Sign-in is a dark sports surface over video, so we
 * lock to dark.a for this scaffold.
 *
 * Exactly one CakeProvider — never nest another.
 */
export default function App() {
  return (
    <CakeProvider mode="dark.a">
      <SignInPage />
    </CakeProvider>
  );
}
