import {myFetch} from "../../utils/fetchWrapper";
import apiUrls from "../../../configs/apiUrl";
import {ResumeTypes} from "../../../types/apps/ResumeTypes";

export const findTimeline = async (resume: ResumeTypes) => {
    try {
        console.log(resume)
        const response = await myFetch(`${apiUrls.apiUrl_RPM_TimeLineEndpoint}/${resume.code}/${resume.domain}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        if (response.status === 204) {
            console.log("No timeline found")

            return null;
        }
        if (response?.ok) {

            return await response.json();
        }
    } catch (error) {
        throw new Error('Failed to find timeline');
    }
};
