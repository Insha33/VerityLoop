import { test, expect, type Page } from '@playwright/test';

async function screenshot(page: Page, name: string, project: string) {
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `artifacts/onboarding/${project}/${name}.png`, fullPage: true });
}
// The dropzone names its browse button and its file input the same; files go to the input.
function fileInput(page: Page) {
  return page.getByLabel('Choose supporting product documents', { exact: true }).and(page.locator('input[type="file"]'));
}
async function signup(page: Page, email = 'alex@acme.com') {
  await page.goto('/sign-up');
  await page.getByLabel('Work email', { exact: true }).fill(email);
  await page.getByRole('button', { name: 'Continue with email' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome, Alex' })).toBeVisible();
}
async function create(page: Page, name: string) {
  await page.goto('/workspaces/new');
  await page.getByLabel('Workspace name').fill(name);
  await page.getByRole('button', { name: 'Create workspace', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Invite your colleagues' })).toBeVisible();
}

test('complete company onboarding and workspace isolation', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/sign-up');
  await screenshot(page, '01-signup', info.project.name);
  await page.getByRole('button', { name: 'Continue with email' }).click();
  await expect(page.getByLabel('Work email', { exact: true })).toHaveAccessibleDescription(/valid email/);
  await signup(page);
  await screenshot(page, '02-dashboard', info.project.name);
  await page.getByRole('link', { name: 'Go to workspaces' }).click();
  await expect(page.getByRole('heading', { name: 'Workspaces', exact: true })).toBeVisible();
  await screenshot(page, '03-workspaces', info.project.name);
  await page.getByRole('button', { name: 'Request access', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Request access', exact: true }).click();
  await page.getByRole('button', { name: 'Send request', exact: true }).click();
  await expect(page.locator('.success-notice')).toContainText('No notification was sent');
  await page.goto('/workspaces/sample-core');
  await expect(page.getByRole('heading', { name: 'This workspace isn’t available' })).toBeVisible();
  await page.goto('/workspaces/sample-developer/connections');
  await expect(page.getByRole('heading', { name: 'Workspace owner access required' })).toBeVisible();
  await page.goto('/workspaces/new');
  await screenshot(page, '04-create-workspace', info.project.name);
  await create(page, 'Customer Platform');
  const workspaceBase = page.url().replace('/invite', '');
  await screenshot(page, '05-invite', info.project.name);
  await page.getByLabel('Work email', { exact: true }).fill('alex@acme.com');
  await page.getByRole('button', { name: 'Send invite & continue' }).click();
  await expect(page.getByLabel('Work email', { exact: true })).toHaveAccessibleDescription(/already the workspace owner/);
  await page.getByLabel('Work email', { exact: true }).fill('sam@acme.com');
  await page.getByRole('button', { name: 'Generate invite link' }).click();
  await expect(page.getByLabel('Link for Customer Platform')).toHaveValue(/previewInvite=/);
  await page.getByRole('button', { name: 'Revoke link' }).click();
  await expect(page.getByText('Link revoked.')).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Send invite & continue' }).click();
  await expect(page.getByRole('button', { name: 'Continue to documents' })).toBeDisabled();
  await screenshot(page, '06-connections', info.project.name);
  await page.getByRole('button', { name: 'Connect', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Add preview connection' })).toBeDisabled();
  await page.getByLabel('Core Platform', { exact: true }).check();
  await page.getByRole('button', { name: 'Add preview connection' }).click();
  await page.getByRole('link', { name: 'Continue to documents' }).click();
  await fileInput(page).setInputFiles({ name: 'bad.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('bad') });
  await expect(page.locator('.file-errors')).toContainText('choose PDF');
  await fileInput(page).setInputFiles({ name: 'Product requirements.md', mimeType: 'text/markdown', buffer: Buffer.from('# Customer Platform PRD') });
  await expect(page.getByText('Added locally', { exact: true })).toBeVisible();
  await screenshot(page, '07-documents', info.project.name);
  await page.reload();
  await expect(page.getByText('Product requirements.md', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Finish workspace setup' }).click();
  await expect(page.getByRole('heading', { name: 'Customer Platform', exact: true })).toBeVisible();
  await create(page, 'Other Product');
  const secondBase = page.url().replace('/invite', '');
  await page.goto(`${secondBase}/documents`);
  await expect(page.getByRole('heading', { name: 'Connect a product tool first' })).toBeVisible();
  await page.goto(`${secondBase}/connections`);
  await expect(page.getByRole('button', { name: 'Connect', exact: true })).toHaveCount(3);
  await page.goto(`${workspaceBase}/documents`);
  await expect(page.getByText('Product requirements.md', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Finish workspace setup' })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('revisiting setup steps after finishing keeps the workspace ready', async ({ page }) => {
  await signup(page);
  await create(page, 'Stage Check');
  const base = page.url().replace('/invite', '');
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await page.getByRole('button', { name: 'Connect', exact: true }).first().click();
  await page.getByLabel('Core Platform', { exact: true }).check();
  await page.getByRole('button', { name: 'Add preview connection' }).click();
  await expect(page.locator('.success-notice')).toContainText('Jira preview connection added');
  await page.goto('/');
  await expect(page.locator('.resume-section')).toContainText('Stage Check');
  await page.goto(`${base}/connections`);
  await page.getByRole('link', { name: 'Continue to documents' }).click();
  await page.getByRole('button', { name: 'Finish workspace setup' }).click();
  await expect(page.getByRole('heading', { name: 'Your workspace is ready for review' })).toBeVisible();

  await page.goto(`${base}/connections`);
  await page.getByRole('button', { name: 'Connect', exact: true }).first().click();
  await page.getByLabel('Product strategy', { exact: true }).check();
  await page.getByRole('button', { name: 'Add preview connection' }).click();
  await expect(page.locator('.success-notice')).toContainText('Confluence preview connection added');
  await page.goto(`${base}/invite`);
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page.getByRole('heading', { name: 'Connect your product tools' })).toBeVisible();

  await page.goto(base);
  await expect(page.getByRole('heading', { name: 'Your workspace is ready for review' })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome, Alex' })).toBeVisible();
  await expect(page.locator('.resume-section')).toHaveCount(0);
});

test('personal email skips organization and mobile navigation works', async ({ page }, info) => {
  await signup(page, 'alex@gmail.com');
  await expect(page.getByText('Personal account', { exact: true })).toBeVisible();
  if ((page.viewportSize()?.width ?? 1440) < 700) {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('link', { name: 'Workspaces', exact: true }).click();
  } else await page.getByRole('link', { name: 'Workspaces', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your first workspace starts here' })).toBeVisible();
  await create(page, 'Personal Product');
  await page.getByRole('button', { name: 'Skip for now' }).click();
  await expect(page.getByRole('heading', { name: 'Connect your product tools' })).toBeVisible();
  await page.goto('/workspaces/sample-developer/connections');
  await expect(page.getByRole('heading', { name: 'This workspace isn’t available' })).toBeVisible();
});

test('signed-out visitors go to sign up, and the dashboard lives at the root', async ({ page }) => {
  await page.goto('/workspaces');
  await expect(page).toHaveURL(/\/sign-up$/);
  await signup(page);
  await expect(page).toHaveURL(/\/$/);
  if ((page.viewportSize()?.width ?? 1440) < 700) await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('link', { name: 'Workspaces', exact: true })).not.toHaveAttribute('aria-current', 'page');
});
