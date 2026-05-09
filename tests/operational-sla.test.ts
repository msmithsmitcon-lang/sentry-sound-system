import {
  resolveSLABreaches
} from "@/lib/submission-dispatch/resolveSLABreaches"

async function main() {

  const breaches =
    await resolveSLABreaches()

  console.log(breaches)
}

main()
  .catch(console.error)
