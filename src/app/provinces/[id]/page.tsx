import Link from 'next/link'
import { ProvinceCities } from './components/Cities'
import { ImmigrationPrograms } from './components/ImmigrationPrograms'
import { SideCard } from 'components/Card/Card'
import { Info } from 'components/Info/Info'
import MaxWidthWrapper from 'components/MaxWidthWrapper'
import { Tabs } from 'components/Tabs'
import { Province, ProvinceModel } from '@core/domain/models'
import { axiosHttp } from '@core/main/http'
import { ProvincesHttpGateway } from '@core/infra/province/provinces-gateway'
import LoadProvincesUsecase from '@core/application/provinces/load-province-usecase'

export async function getProvinceBy(id: string): Promise<ProvinceModel> {
  const getProvinceByGateway = new ProvincesHttpGateway(axiosHttp)
  return new LoadProvincesUsecase(getProvinceByGateway).load(id)
}

type ProvinceType = {
  params: {
    id: string
  }
}

export async function getProvinces(): Promise<Province[]> {
  const loadProvincesGateway = new ProvincesHttpGateway(axiosHttp)
  return new LoadProvincesUsecase(loadProvincesGateway).loadAll()
}

async function ProvincePage({ params }: ProvinceType) {
  const { id } = params
  const province = await getProvinceBy(id)
  const provinces = await getProvinces()
  const { cities, Immigration, ProvinceOverview } = province
  // TODO: Throw Error
  if (!ProvinceOverview || !cities || !Immigration) return
  const { ProvinceScores, banner_url } = ProvinceOverview
  const provinceLabel = province.name

  const tabs = [
    {
      name: 'Province',
      label: provinceLabel,
      // TODO: Temporary image
      content: (
        <Info scores={ProvinceScores} image={banner_url} alt="province_map" />
      )
    },
    {
      name: 'Cities',
      label: 'Cities',
      content: <ProvinceCities cities={cities} />
    },
    {
      name: 'Immigration Programs',
      label: 'Immigration Programs',
      content: <ImmigrationPrograms immigrationPrograms={Immigration} />
    }
  ]

  return (
    <MaxWidthWrapper>
      <div className="p-4">
        <div className="mb-4 gap-4 flex xl:grid xl:grid-cols-[repeat(auto-fill,minmax(auto,16rem))]">
          {provinces.map((province) => (
            <Link key={province.id} href={`/provinces/${province.id}`}>
              <SideCard
                className={
                  province.name === provinceLabel
                    ? 'border-1 border-indigo-500 text-indigo-500'
                    : 'text-gray-500'
                }
                title={province.name}
                slug={province.slug}
                image={province.image_url}
              />
            </Link>
          ))}
        </div>
        <section className="flex-1 block overflow-hidden rounded-t-2xl ">
          <header
            className="h-96 mg-4 bg-no-repeat bg-center bg-cover w-full rounded-t-2xl"
            style={{
              backgroundImage: `url(${banner_url})`
            }}
          />
          <main className="bg-white rounded-t-3xl ">
            <Tabs tabs={tabs} />
          </main>
        </section>
      </div>
    </MaxWidthWrapper>
  )
}

export default ProvincePage
