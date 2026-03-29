import { countries, getCountryBySlug } from '@/data/countries';
import { adminOverview, coachAccount, globalPages, mockSession, users } from '@/data/portal';
import { resources, globalEvents } from '@/data/content';

async function wait(ms = 10) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getChapters() {
  await wait();
  return countries;
}

export async function getChapter(slug: string) {
  await wait();
  return getCountryBySlug(slug);
}

export async function getPortalSession() {
  await wait();
  return mockSession;
}

export async function getAdminOverview() {
  await wait();
  return adminOverview;
}

export async function getGlobalPages() {
  await wait();
  return globalPages;
}

export async function getUsers() {
  await wait();
  return users;
}

export async function getCoachAccount() {
  await wait();
  return coachAccount;
}

export async function getGlobalResources() {
  await wait();
  return resources;
}

export async function getGlobalEvents() {
  await wait();
  return globalEvents;
}
