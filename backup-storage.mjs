import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'
import path from 'node:path'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const outputDir = './backup/storage'

async function walk(bucket, prefix = '') {
  let offset = 0
  while (true) {
    const { data: items, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 100, offset })
    if (error) throw error
    if (!items.length) break

    for (const item of items) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name

      if (item.id === null) {
        await walk(bucket, itemPath)
        continue
      }

      const { data: blob, error: downloadError } = await supabase.storage
        .from(bucket)
        .download(itemPath)
      if (downloadError) {
        console.error('FAIL', bucket, itemPath, downloadError.message)
        continue
      }

      const destination = path.join(outputDir, bucket, itemPath)
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.writeFile(destination, Buffer.from(await blob.arrayBuffer()))
      console.log('ok', bucket, itemPath)
    }

    offset += items.length
  }
}

const { data: buckets, error } = await supabase.storage.listBuckets()
if (error) throw error
for (const bucket of buckets) await walk(bucket.name)
