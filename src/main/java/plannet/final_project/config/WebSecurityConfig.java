package plannet.final_project.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity // Spring 클래스를 찾아 웹 보안 설정을 구성하도록 하는 어노테이션
// MethodSecurity는 기존 SecurityConfig 설정이 적용되지 않는다. 그렇기에 해당 어노테이션을 비활성화한다
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor // 생성자를 통한 의존성 주입 -> 순환 참조 문제를 컴파일 단계에서 해결
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // CrossOriginResourceSharing 문제 해결
            .cors().and()
            // CrossSiteRequestForgery 비활성화, RestApi 에서는 Stateless 방식이기 때문에 비활성화한다
            .csrf().disable()
            // X-Frame-Options 비활성화 설정 단, 보안적 이슈 발생 가능성 존재
            .headers().frameOptions().disable().and()
            // 권한 인증 관련 문제 발생시 에러를 핸들링할 수 있는 핸들러
            // .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
            // Spring Security 는 Session 정책을 사용하기 위한 설정
            // 세션을 따로 사용하지 않고 JWT를 사용할 것이기 때문에 STATELESS를 설정하여 비활성화
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            // 시큐리티 처리에 HttpServletRequest 사용 의미
            // HttpServletRequest: Http 프로토콜 Request 정보를 서블릿에게 전달하기 위한 목적으로 사용,
            // Header , Parameter, Cookie, URI, URL 등의 정보를 읽어들이는 메소드를 가진 클래스
            .authorizeRequests()
            // permitAll(): 모든 권한을 허용하는 URL
            .antMatchers("/**").permitAll()
            // .antMatchers("/member/**").permitAll()
            // .antMatchers("/home/**").permitAll()
            // .antMatchers("/index/**").permitAll()
            // .antMatchers("/api/v1/users/**").permitAll()
            // .antMatchers("/error").permitAll()
            // .antMatchers("/h2-console/**").permitAll()
            // 해당 권한을 가진 사용자만 허용하도록 설정, String 을 파라미터로 받음
            // .antMatchers("/api/v1/test/user").hasAnyRole("USER", "ADMIN")
            // .antMatchers("/api/v1/test/admin").hasRole("ADMIN")
            .anyRequest().authenticated().and()
            // disable()은 H2 Console 활용하기 위해 설정, 그러나 보안적 취약점을 가짐.
            .csrf().ignoringAntMatchers("/h2-console/**").disable();
            // UsernamePasswordAuthenticationFilter 동작 전 먼저 동작하게 되는 필터를 설정
            // http.addFilterBefore(authenticationJwtFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}