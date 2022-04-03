#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform vec3 light0;
uniform vec3 light1;
uniform vec3 light2;
uniform vec3 light3;
uniform vec3 light4;
uniform vec3 light5;
uniform vec3 light6;
uniform vec3 light7;
uniform vec2 size;
uniform float time;
uniform float enabled;

const float PI = 3.1415926535;

void main() {
  float apertureHalf = 0.5 * 180.0 * (PI / 180.0);
  
  // This factor ajusts the coordinates in the case that
  // the aperture angle is less than 180 degrees, in which
  // case the area displayed is not the entire half-sphere.
  float maxFactor = sin(apertureHalf);
  
  // The st factor takes into account the situation when non-pot
  // textures are not supported, so that the maximum texture
  // coordinate to cover the entire image might not be 1.
  vec2 stFactor = vec2(1.0, 1.0); // vec2(1.0 / abs(texMatrix[0][0]), 1.0 / abs(texMatrix[1][1]));  
  vec2 pos = (2.0 * vTexCoord.st * stFactor - 1.0);
  float ratio = size.y / size.x;
  
  float l = length(pos);
  float u;
  float v;
  
  if (false && l > 1.0) {
    gl_FragColor = vec4(0, 0, 0, 1);
    return;
  } else {
    float x = maxFactor * pos.x;
    float y = maxFactor * pos.y;
    
    float n = length(vec2(x, y));
    
    float z = sqrt(1.0 - n * n * 0.2 * ((sin(time * 0.1) * 2.0 + 1.0) * 0.1));
  
    float r = atan(n, z) / PI * 2.0; 
  
    float phi = atan(y, x);

    u = r * cos(phi) + 0.5;
    v = r * sin(phi) + 0.5;
  }

  vec2 uv = vec2(u, v) / stFactor;
  uv.y = 1.0 - uv.y;
  
  vec4 color = texture2D(tex0, uv);
  
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));

  float d = 10.0;

  {
    float dx = light0.x - uv.x;
    float dy = (light0.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light0.z;

    d = min(d, dd);
  }

  {
    float dx = light1.x - uv.x;
    float dy = (light1.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light1.z;

    d = min(d, dd);
  }

  {
    float dx = light2.x - uv.x;
    float dy = (light2.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light2.z;

    d = min(d, dd);
  }

  {
    float dx = light3.x - uv.x;
    float dy = (light3.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light3.z;

    d = min(d, dd);
  }

  {
    float dx = light4.x - uv.x;
    float dy = (light4.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light4.z;

    d = min(d, dd);
  }

  {
    float dx = light5.x - uv.x;
    float dy = (light5.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light5.z;

    d = min(d, dd);
  }

  {
    float dx = light6.x - uv.x;
    float dy = (light6.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light6.z;

    d = min(d, dd);
  }

  {
    float dx = light7.x - uv.x;
    float dy = (light7.y - uv.y) * ratio;
    float dd = sqrt(dx * dx + dy * dy) * light7.z;

    d = min(d, dd);
  }

  float vv = max(0.0, 1.0 - d * d * d * 80.0);
  float vvv = vv * vv * vv * 1.5;

	gl_FragColor = enabled < 0.5 ? color: vec4(color.r * vvv + gray * (1.0 - vv), color.g * vvv + gray * (1.0 - vv), color.b * vvv + gray * (1.0 - vv), 1.0 - d * 2.5); // 1.0 - l * 0.8);
}