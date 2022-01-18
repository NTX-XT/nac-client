/* eslint-disable @typescript-eslint/ban-types */
import NodeCache from "node-cache";
import { useAdapter } from "@type-cacheable/node-cache-adapter";
import cacheManager, { Cacheable } from "@type-cacheable/core";


cacheManager.setOptions({
    ttlSeconds: 5000,
    excludeContext: false
})
cacheManager.setClient(useAdapter(new NodeCache()))

export default cacheManager
export { Cacheable }
