import { useRouter } from 'next/router';

export default function Menu() {
  const router = useRouter()
  return (
    <li>
        <button type="button" onClick={() => router.push('/chain-info')}>
        chain-info
        </button>
        <button type="button" onClick={() => router.push('/fakeBayc')}>
        fakeBayc
        </button>
        <button type="button" onClick={() => router.push('/fakeBayc/1')}>
        /fakeBayc/1
        </button>
        <button type="button" onClick={() => router.push('/fakeBayc/900')}>
        /fakeBayc/900
        </button>
        <button type="button" onClick={() => router.push('/nefturians')}>
        nefturians
        </button>
        <button type="button" onClick={() => router.push('/nefturians/1')}>
        nefturians/1
        </button>
    </li>
  )
}