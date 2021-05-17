import make_id from './_make_id';

export default function(): string {
  return make_id(this.header) + '-section';
}