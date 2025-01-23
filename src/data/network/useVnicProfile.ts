// import {VnicProfilePoolMemberDto} from "@/api";
// import {useMutation} from "@tanstack/react-query";
// // import {useQuery} from "@tanstack/react-query";
// import {privateAxios} from "@/data/privateAxios";
// // import {useTranslation} from "react-i18next";
// // import {keys} from "@/data/keys";
// // import {toast} from "sonner";
//
// // export const useVnicProfile = () => {
// //     const {data, isLoading} = useQuery({
// //         queryKey: [],
// //         queryFn: async () => {
// //             const response = await privateAxios.get<VnicProfilePoolMemberDto>(
// //                 `/resources/vnic-profiles/eduvirt/${vnicProfileId}`
// //             );
// //             return response.data;
// //         },
// //     });
// //
// //     return {vnicProfile: data, isLoading};
// // };
//
// export const useVnicProfile = () => {
//     const {mutate, mutateAsync} = useMutation({
//         mutationKey: ["getVnicProfileInfo"],
//         mutationFn: async (vnicProfileId: string) => {
//             const response = await privateAxios.get<VnicProfilePoolMemberDto>(
//                 `/resources/vnic-profiles/eduvirt/${vnicProfileId}`
//             );
//             return response.data;
//         },
//     });
//
//     return {getVnicProfileInfo: mutate, getVnicProfileInfoAsync: mutateAsync};
// };