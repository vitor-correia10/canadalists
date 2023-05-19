import { Province } from '@prisma/client'
import { Card } from 'app/components/Card/Card'
import axios from 'axios'
import MaxWidthWrapper from 'app/components/MaxWidthWrapper'
import Link from 'next/link'
export type Provinces = {
  provinces: Province[]
}

export async function getProvinces(): Promise<Provinces> {
  const res = await axios.get(`${process.env.BASE_URL}/api/provinces`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
  return res.data
}
async function Provinces() {
  const { provinces } = await getProvinces()

  return (
    <MaxWidthWrapper>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
        {provinces.map((province) => (
          <Link key={province.id} href={`/provinces/${province.name}`}>
            <Card
              slug={province.slug}
              title={province.name}
              image={province.imageUrl}
            />
          </Link>
        ))}
      </div>
    </MaxWidthWrapper>
  )
}

export default Provinces
