package plannet.final_project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import plannet.final_project.service.WriteService;
import plannet.final_project.vo.WriteDTO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/write")
@RequiredArgsConstructor
public class WriteController {
    private final WriteService writeService;

    //일정 불러오기
    @PostMapping("/load")
    public ResponseEntity<List<Object>> writeLoad(@RequestBody Map<String, Object> wrLoad) {
        String userId = (String)wrLoad.get("id");
        LocalDate date = LocalDate.parse((String)wrLoad.get("date"));
        WriteDTO planAndDiary = writeService.writeLoad(userId, date);
        List<Object> writeData = new ArrayList<>();
        writeData.add(planAndDiary.getPlanList());
        writeData.add(planAndDiary.getDiary());

        if(planAndDiary.isOk()) {
            return new ResponseEntity(writeData, HttpStatus.OK);
        }
        else {
            return new ResponseEntity(null, HttpStatus.OK);
        }
    }

    // 일정 저장
    @PostMapping("/save")
    public ResponseEntity<Boolean> writeSave(@RequestBody Map<String, Object> wrSave) {
        String userId = (String)wrSave.get("id");
        LocalDate date = LocalDate.parse((String)wrSave.get("date"));
        List<Map<String, Object>> plan = (List<Map<String, Object>>)wrSave.get("plan");
        String diary= (String)wrSave.get("diary");
        boolean result = writeService.writeSave(userId, date, plan, diary);
        if(result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }
}