import { getApplication, getApplications } from '@soda/soda-core';

export const getApplicationNames = () => {
  const apps = getApplications();
  const res = [];
  for (const a of Object.keys(apps)) res.push(a);
  return res;
};
export const getHostUrl = (app: string) => {
  const a = getApplication(app);
  if (a && a.getConfig) {
    return a.getConfig().hostLeadingUrl;
  }
  return '';
};
export const getIcon = (app: string) => {
  const a = getApplication(app);
  if (a && a.getConfig) {
    return a.getConfig().icon;
  }
  return '';
};
export const getUserPage = (app: string, appid?: string) => {
  const a = getApplication(app);
  if (a && a.getUserPage) {
    return a.getUserPage({ appid });
  }
  return '';
};
