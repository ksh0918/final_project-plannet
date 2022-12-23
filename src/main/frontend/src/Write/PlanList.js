import PlanItem from "./PlanItem";

const PlanList = ({planList, setPlanList, isPage}) => {    
    return (
        <ul>
            {planList && planList.map((planItem) => {
                if(planItem.deleted) return null;
                else return (
                    <PlanItem
                    key={planItem.key} // planList의 id(Plan 엔티티의 planNo에 해당)를 key로 수정해서 key로 바꿔줌
                    planItem={planItem}
                    planList={planList}
                    setPlanList={setPlanList}
                    isPage={isPage}
                    />
                );
            })}
        </ul>
    );
}

export default PlanList;