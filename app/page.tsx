import { contacts } from '@/config/contacts'
import { HomeTemplate } from '@/components/templates/home-template'

export default function HomePage() {
  return <HomeTemplate contacts={contacts} />
}
