export interface Page {
  id: string;
  title: string;
  summary: string;
  links: Link[];
  createdAt: string;
}

export interface Link {
  title: string;
  url: string;
}

export interface Message {
  type: string;
  title?: string;
  summary?: string;
  links?: Link[];
}
