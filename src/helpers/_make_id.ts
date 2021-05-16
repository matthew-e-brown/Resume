export default function (str: string) {
  return str.toLowerCase().replace(/[^\w+]/g, '-');
}