package plannet.final_project.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@CrossOrigin
@RestController
public class RefreshController implements ErrorController {
    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    // ModelAndView객체는 Model객체와 데이터를 넘길 페이지값을 가진 return을 합친 것이다. 즉, 데이터와 넘길 페이지의 값을 모두 가지고 있는 객체이다.
    public ModelAndView saveLeadQuery() {
        return new ModelAndView("forward:/"); // 참고 사이트 https://mangkyu.tistory.com/51
    }
}