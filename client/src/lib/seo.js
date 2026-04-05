export function setMetaDescription(content) {
  if (!content) return;
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function setTitleAndDescription({ title, description }) {
  if (title) document.title = title;
  if (description) setMetaDescription(description);
}

