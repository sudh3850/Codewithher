const DB_KEY = 'safenest_contacts';

export const saveContacts = (contacts) => {
  localStorage.setItem(DB_KEY, JSON.stringify(contacts));
};

export const getContacts = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse contacts', e);
    return [];
  }
};

export const deleteContact = (emailOrPhone) => {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.phone !== emailOrPhone && c.email !== emailOrPhone);
  saveContacts(filtered);
};

export const addContact = (contact) => {
  const contacts = getContacts();
  contacts.push(contact);
  saveContacts(contacts);
};
