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
    @GetMapping("/load")
    public ResponseEntity<List<Object>> writeLoad(@RequestParam String id, String date) {
        LocalDate writeDate = LocalDate.parse(date);

        WriteDTO planAndDiary = writeService.writeLoad(id, writeDate);
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
    public ResponseEntity<Boolean> writeSave(@RequestBody Map<String, Object> data) {
        String userId = (String)data.get("id");
        LocalDate date = LocalDate.parse((String)data.get("date"));
        List<Map<String, Object>> plan = (List<Map<String, Object>>)data.get("plan");
        String diary= (String)data.get("diary");
        boolean result = writeService.writeSave(userId, date, plan, diary);
        if(result) return new ResponseEntity(true, HttpStatus.OK);
        else return new ResponseEntity(false, HttpStatus.OK);
    }
}