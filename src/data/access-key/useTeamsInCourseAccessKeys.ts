import { useQueries } from "@tanstack/react-query"
import { keys } from "../keys"
import { AccessKeyControllerApi } from "@/api"

export const useTeamsInCourseAccessKeys = (teamIds: string[], enabled: boolean) => {
    return useQueries({
        queries: teamIds.map(id => ({
            queryKey: [keys.ACCESS_KEY, id],
            queryFn: async () => {
                const controller = new AccessKeyControllerApi()
                const response = await controller.getKeyForTeam(id)
                return { id, key: response.data }
            },
            enabled: enabled
        }))
    })
}