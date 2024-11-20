import PageHeader from "@/components/PageHeader.tsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useVnicProfiles} from "@/data/network/useVnicProfiles.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAddVnicProfileToPool} from "@/data/network/useAddVnicProfileToPool.ts";
import {useRemoveVnicProfileFromPool} from "@/data/network/useRemoveVnicProfileFromPool.ts";
import {Link} from "react-router-dom";
import {Separator} from "@/components/ui/separator.tsx";

const VnicProfilesPage: React.FC = () => {
    const {vnicProfiles, isLoading} = useVnicProfiles();
    const {addVnicProfileToPoolAsync} = useAddVnicProfileToPool();
    const {removeVnicProfileFromPoolAsync} = useRemoveVnicProfileFromPool();

    const handleAddVnicProfile = (async (vnicProfileId : string | undefined) => {
        if (typeof vnicProfileId === "string") {
            await addVnicProfileToPoolAsync(vnicProfileId);
        }
    });

    const handleRemoveVnicProfileFromPool = (async (vnicProfileId : string | undefined) => {
        if (typeof vnicProfileId === "string") {
            await removeVnicProfileFromPoolAsync(vnicProfileId);
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    /// TODO pagination
    /// TODO add displaying extended info about selected vnic profile (isInUse, maybe id etc...)
    return (
        <>
            <PageHeader title="Vnic profiles"/>
            <Table>
                <TableCaption>A list of vnic profiles.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vnic profile name</TableHead>
                        <TableHead>Network name</TableHead>
                        <TableHead>Network VLAN ID</TableHead>
                        <TableHead>In pool</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(vnicProfiles?.length == 0 ? [] : vnicProfiles)?.map((vnicProfile) => (
                        <TableRow key={vnicProfile.id}>
                            <TableCell>{vnicProfile.name}</TableCell>
                            <TableCell>{vnicProfile.networkName}</TableCell>
                            <TableCell>{vnicProfile.networkVlanId ?? '-'}</TableCell>
                            <TableCell>
                                <Checkbox disabled={true} checked={vnicProfile.inPool}/>
                            </TableCell>
                            <TableCell>
                                <Button disabled={vnicProfile.inPool} onClick={() => handleAddVnicProfile(vnicProfile.id)}>Add to pool</Button>
                            </TableCell>
                            <TableCell>
                                <Button disabled={!vnicProfile.inPool} onClick={() => handleRemoveVnicProfileFromPool(vnicProfile.id)}>Remove from pool</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div>
                <br />
                <Separator />
                <br />
            </div>
            <Button asChild>
                <Link to={'/networks/vlans'}>VLAN ranges</Link>
            </Button>
        </>
    );
};

export default VnicProfilesPage;